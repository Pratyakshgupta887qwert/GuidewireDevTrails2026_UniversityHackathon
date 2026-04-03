import asyncio
import math
import os
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Generator, Optional
from uuid import UUID, uuid4

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, field_validator
from passlib.context import CryptContext
from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, String, Text, UniqueConstraint, create_engine, select, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:password@localhost:5432/aegisai")
PORT = int(os.getenv("PORT", "8000"))
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:5173")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

POLICY_TIERS = {
    "low": {"tier_name": "Basic", "premium": Decimal("15"), "coverage": Decimal("1000")},
    "medium": {"tier_name": "Standard", "premium": Decimal("25"), "coverage": Decimal("2000")},
    "high": {"tier_name": "Extended", "premium": Decimal("35"), "coverage": Decimal("3000")},
}


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(20), unique=True)
    password_hash: Mapped[str] = mapped_column(Text)
    zone: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    upi_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    aadhaar_number: Mapped[Optional[str]] = mapped_column(String(12), nullable=True)
    aadhaar_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    policies: Mapped[list["Policy"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    claims: Mapped[list["Claim"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Policy(Base):
    __tablename__ = "policies"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    tier_name: Mapped[str] = mapped_column(String(20))
    policy_start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    policy_end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    premium_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    coverage_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    risk_level: Mapped[str] = mapped_column(String(10))
    status: Mapped[str] = mapped_column(String(10))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user: Mapped[User] = relationship(back_populates="policies")
    claims: Mapped[list["Claim"]] = relationship(back_populates="policy", cascade="all, delete-orphan")


class Claim(Base):
    __tablename__ = "claims"
    __table_args__ = (UniqueConstraint("policy_id", "event_type", name="uq_claim_policy_event"),)

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    policy_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("policies.id", ondelete="CASCADE"))
    event_type: Mapped[str] = mapped_column(String(50))
    payout_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    status: Mapped[str] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user: Mapped[User] = relationship(back_populates="claims")
    policy: Mapped[Policy] = relationship(back_populates="claims")


class SignUpPayload(BaseModel):
    name: str
    phone: str
    password: str
    zone: Optional[str] = None
    upi: Optional[str] = None


class SignInPayload(BaseModel):
    phone: str
    password: str


class UpdateSettingsPayload(BaseModel):
    phone: str
    name: Optional[str] = None
    zone: Optional[str] = None
    upi_id: Optional[str] = None


class AadhaarPayload(BaseModel):
    user_id: UUID
    aadhaar_number: str

    @field_validator("aadhaar_number")
    @classmethod
    def validate_aadhaar(cls, value: str) -> str:
        if not value.isdigit() or len(value) != 12:
            raise ValueError("Aadhaar number must be exactly 12 digits")
        return value


class PurchasePayload(BaseModel):
    user_id: UUID
    selected_tier: str

    @field_validator("selected_tier")
    @classmethod
    def validate_tier(cls, value: str) -> str:
        normalized = value.strip().lower()
        alias_map = {"basic": "low", "standard": "medium", "extended": "high"}
        normalized = alias_map.get(normalized, normalized)
        if normalized not in POLICY_TIERS:
            raise ValueError("selected_tier must be low, medium, or high")
        return normalized


class ClaimPayload(BaseModel):
    user_id: UUID
    policy_id: UUID
    event_type: str
    hourly_rate: Decimal
    disruption_hours: Decimal


class AdminEventPayload(BaseModel):
    event_type: str = "heavy_rain"
    rain: int = 12
    disruption_hours: Decimal = Decimal("3")
    hourly_rate: Decimal = Decimal("150")


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    phone: str
    zone: Optional[str] = None
    upi_id: Optional[str] = None
    aadhaar_number: Optional[str] = None
    aadhaar_verified: bool


app = FastAPI(title="AegisAI Policy Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

current_rain_level = 0
is_disrupted = False


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_database_ready() -> None:
    with engine.begin() as connection:
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS pgcrypto"))
    Base.metadata.create_all(bind=engine)


def serialize_user(user: User) -> UserResponse:
    return UserResponse.model_validate(user)


def expire_stale_policies(db: Session) -> int:
    now = datetime.now(timezone.utc)
    result = db.execute(
        text(
            """
            UPDATE policies
            SET status = 'expired'
            WHERE status = 'active' AND policy_end_date <= :now
            """
        ),
        {"now": now},
    )
    db.commit()
    return result.rowcount or 0


def get_active_policy_for_user(db: Session, user_id: UUID) -> Optional[Policy]:
    expire_stale_policies(db)
    return db.scalar(
        select(Policy)
        .where(Policy.user_id == user_id, Policy.status == "active")
        .order_by(Policy.policy_end_date.desc())
    )


def policy_to_summary(policy: Policy) -> dict:
    now = datetime.now(timezone.utc)
    seconds_left = max((policy.policy_end_date - now).total_seconds(), 0)
    days_remaining = math.ceil(seconds_left / 86400) if seconds_left > 0 else 0
    return {
        "id": str(policy.id),
        "tier_name": policy.tier_name,
        "premium": float(policy.premium_amount),
        "coverage": float(policy.coverage_amount),
        "risk_level": policy.risk_level,
        "days_remaining": days_remaining,
        "status": policy.status,
        "policy_start_date": policy.policy_start_date.isoformat(),
        "policy_end_date": policy.policy_end_date.isoformat(),
    }


def create_claim(
    db: Session,
    *,
    user: User,
    policy: Policy,
    event_type: str,
    hourly_rate: Decimal,
    disruption_hours: Decimal,
) -> Claim:
    if not user.aadhaar_verified:
        raise HTTPException(status_code=403, detail="Verify Aadhaar before claiming a payout")

    expire_stale_policies(db)
    db.refresh(policy)
    if policy.status != "active":
        raise HTTPException(status_code=400, detail="Policy is no longer active")

    existing_claim = db.scalar(
        select(Claim).where(Claim.policy_id == policy.id, Claim.event_type == event_type)
    )
    if existing_claim:
        raise HTTPException(status_code=409, detail="Claim already processed for this event")

    payout = min(hourly_rate * disruption_hours, policy.coverage_amount)
    claim = Claim(
        user_id=user.id,
        policy_id=policy.id,
        event_type=event_type,
        payout_amount=payout,
        status="auto_paid",
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)
    return claim


@app.on_event("startup")
async def on_startup() -> None:
    ensure_database_ready()

    async def expiry_worker() -> None:
        while True:
            try:
                with SessionLocal() as db:
                    expire_stale_policies(db)
            except Exception as exc:
                print(f"Policy expiry worker error: {exc}")
            await asyncio.sleep(3600)

    app.state.expiry_task = asyncio.create_task(expiry_worker())


@app.on_event("shutdown")
async def on_shutdown() -> None:
    expiry_task = getattr(app.state, "expiry_task", None)
    if expiry_task:
        expiry_task.cancel()


@app.get("/api/health")
def healthcheck() -> dict:
    return {"status": "ok"}


@app.get("/api/risk-status")
def get_risk_status() -> dict:
    return {
        "zone": "Sector 62, Noida",
        "rainLevel": current_rain_level,
        "isDisrupted": is_disrupted,
        "payoutAmount": 450 if is_disrupted else 0,
        "status": "CRITICAL" if is_disrupted else "STABLE",
    }


@app.post("/api/signup")
def signup(payload: SignUpPayload, db: Session = Depends(get_db)) -> dict:
    existing_user = db.scalar(select(User).where(User.phone == payload.phone))
    if existing_user:
        raise HTTPException(status_code=409, detail="Phone number already registered")

    user = User(
        name=payload.name,
        phone=payload.phone,
        password_hash=pwd_context.hash(payload.password),
        zone=payload.zone,
        upi_id=payload.upi,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Registration successful", "user": serialize_user(user).model_dump(mode="json")}


@app.post("/api/signin")
def signin(payload: SignInPayload, db: Session = Depends(get_db)) -> dict:
    user = db.scalar(select(User).where(User.phone == payload.phone))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if not pwd_context.verify(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"message": "Logged in successfully", "user": serialize_user(user).model_dump(mode="json")}


@app.post("/api/update-settings")
def update_settings(payload: UpdateSettingsPayload, db: Session = Depends(get_db)) -> dict:
    user = db.scalar(select(User).where(User.phone == payload.phone))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.name is not None:
        user.name = payload.name
    if payload.zone is not None:
        user.zone = payload.zone
    if payload.upi_id is not None:
        user.upi_id = payload.upi_id

    db.commit()
    db.refresh(user)
    return {"message": "Settings updated successfully", "user": serialize_user(user).model_dump(mode="json")}


@app.post("/api/user/verify-aadhaar")
def verify_aadhaar(payload: AadhaarPayload, db: Session = Depends(get_db)) -> dict:
    user = db.get(User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.aadhaar_number = payload.aadhaar_number
    user.aadhaar_verified = True
    db.commit()
    db.refresh(user)
    return {"message": "Aadhaar verified successfully", "user": serialize_user(user).model_dump(mode="json")}


@app.post("/api/policy/purchase")
def purchase_policy(payload: PurchasePayload, db: Session = Depends(get_db)) -> dict:
    user = db.get(User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    active_policy = get_active_policy_for_user(db, payload.user_id)
    if active_policy:
        raise HTTPException(status_code=409, detail="You already have an active policy")

    tier = POLICY_TIERS[payload.selected_tier]
    start_time = datetime.now(timezone.utc)
    policy = Policy(
        user_id=user.id,
        tier_name=tier["tier_name"],
        policy_start_date=start_time,
        policy_end_date=start_time + timedelta(days=7),
        premium_amount=tier["premium"],
        coverage_amount=tier["coverage"],
        risk_level=payload.selected_tier,
        status="active",
    )

    db.add(policy)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="You already have an active policy")
    db.refresh(policy)
    return {"message": "Policy Activated for 7 Days", "policy": policy_to_summary(policy)}


@app.get("/api/policy/active/{user_id}")
def get_active_policy(user_id: UUID, db: Session = Depends(get_db)) -> dict:
    policy = get_active_policy_for_user(db, user_id)
    if not policy:
        raise HTTPException(status_code=404, detail="No active policy")
    return policy_to_summary(policy)


@app.post("/api/claim/submit")
def submit_claim(payload: ClaimPayload, db: Session = Depends(get_db)) -> dict:
    user = db.get(User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    policy = db.get(Policy, payload.policy_id)
    if not policy or policy.user_id != user.id:
        raise HTTPException(status_code=404, detail="Policy not found for user")

    claim = create_claim(
        db,
        user=user,
        policy=policy,
        event_type=payload.event_type,
        hourly_rate=payload.hourly_rate,
        disruption_hours=payload.disruption_hours,
    )
    return {
        "message": "Claim processed successfully",
        "claim": {
            "id": str(claim.id),
            "event_type": claim.event_type,
            "payout_amount": float(claim.payout_amount),
            "status": claim.status,
            "created_at": claim.created_at.isoformat(),
        },
    }


@app.get("/api/claims/{user_id}")
def list_claims(user_id: UUID, db: Session = Depends(get_db)) -> dict:
    claims = db.scalars(
        select(Claim).where(Claim.user_id == user_id).order_by(Claim.created_at.desc())
    ).all()
    return {
        "claims": [
            {
                "id": str(claim.id),
                "policy_id": str(claim.policy_id),
                "event_type": claim.event_type,
                "payout_amount": float(claim.payout_amount),
                "status": claim.status,
                "created_at": claim.created_at.isoformat(),
            }
            for claim in claims
        ]
    }


@app.post("/api/admin/trigger-event")
def trigger_event(payload: AdminEventPayload, db: Session = Depends(get_db)) -> dict:
    global current_rain_level, is_disrupted

    current_rain_level = payload.rain
    is_disrupted = payload.rain > 8 and payload.disruption_hours > 0

    expire_stale_policies(db)
    generated_claims = []

    if is_disrupted:
        active_policies = db.scalars(select(Policy).where(Policy.status == "active")).all()
        for policy in active_policies:
            user = db.get(User, policy.user_id)
            if not user or not user.aadhaar_verified:
                continue
            existing_claim = db.scalar(
                select(Claim).where(Claim.policy_id == policy.id, Claim.event_type == payload.event_type)
            )
            if existing_claim:
                continue
            claim = create_claim(
                db,
                user=user,
                policy=policy,
                event_type=payload.event_type,
                hourly_rate=payload.hourly_rate,
                disruption_hours=payload.disruption_hours,
            )
            generated_claims.append(
                {
                    "claim_id": str(claim.id),
                    "user_id": str(user.id),
                    "policy_id": str(policy.id),
                    "payout_amount": float(claim.payout_amount),
                }
            )

    return {
        "message": "System state updated",
        "isDisrupted": is_disrupted,
        "rainLevel": current_rain_level,
        "claimsGenerated": generated_claims,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
