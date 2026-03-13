# GuidewireDevTrails2026_UniversityHackathon
# Smart Gig Insurance Platform (AI‑Powered Parametric Insurance) — MVP / Hackathon Build

A parametric micro‑insurance platform for gig workers that **automatically detects external disruptions** (rain, heatwaves, curfew/lockdowns, AQI) using real-time signals and **triggers instant payouts** without manual claims.

---

## 1) The Idea (Core Strategy)

Gig workers lose income when external conditions make working unsafe or impossible. Traditional insurance is slow, claim-heavy, and expensive.  
This project uses **parametric insurance**: payouts are triggered purely by **objective thresholds** (e.g., rain > 15mm/hr), not by manual evidence submission.

**Goal (MVP):**
- Let a worker buy a **7‑day policy**.
- Detect a disruption event (or simulate via Admin “God Mode”).
- Automatically evaluate eligible workers, run fraud checks, and record payout status.
- Show the worker a **clear claim/payout timeline** and a **financial tracker**.

---

## 2) Personas + Scenarios (Requirement in Human Terms)

### Persona A — Gig Worker (Rahul)
- Delivers food, earns ~₹800/day.
- If heavy rain forces him to stop for 4 hours, he loses ₹300–₹400.
- Needs a **cheap**, **transparent**, **instant** safety net.

#### Scenario A1: Onboarding & Profiling
1. Rahul logs in via **Phone + OTP**.
2. Adds profile details:
   - Name
   - Platform: Swiggy / Zomato / Amazon / Other
   - Avg Daily Income
   - Avg Working Hours
   - UPI ID
3. App requests GPS permission and stores last known location pings.
4. System calculates: **Hourly Wage = Avg Daily Income / Working Hours**

**Outcome:** Rahul is eligible for risk scoring and policy purchase.

#### Scenario A2: Buy Weekly Policy (7 Days)
1. Rahul opens app dashboard.
2. Sees:
   - **Zone Risk Score (0–100)**
   - Risk label (Low/Medium/High)
   - Premium options + explanations (“frequent heavy rain expected”)
3. Rahul taps **Buy Policy** and completes a **mock Razorpay (Test Mode)** payment.
4. Backend issues a **Policy ID** valid for exactly **7 days**.

**Outcome:** Rahul is covered for the next 7 days up to the tier’s coverage limit.

#### Scenario A3: Disruption Happens → Auto Payout
1. A weather/curfew/AQI event occurs (or admin triggers it).
2. Backend finds active policies within the affected zone.
3. Backend runs fraud checks:
   - GPS distance check (within 10 km of zone)
   - Duplicate claim check (same event)
   - Trust score check
4. If valid: payout is computed and recorded.

**Outcome:** Rahul receives an instant payout entry in Claim History + a notification.

---

### Persona B — Platform Admin (Priya)
- Oversees platform health.
- Needs analytics, claims monitoring, and a demo simulation switch (“God Mode”).

#### Scenario B1: Admin Analytics
Priya opens the web dashboard and sees KPI cards:
- Total Active Workers
- Total Active Policies
- Total Premium Collected (₹)
- Total Payouts Issued (₹)

Also sees a chart of claims frequency over the last 30 days.

#### Scenario B2: “God Mode” Event Trigger (Hackathon Demo)
Priya triggers a disruption manually:
- Event Type: Rain / Heatwave / Curfew
- Location/Zone: dropdown
- Duration: hours

Backend executes the same parametric engine as if the event came from a real API.

**Outcome:** Judges can see end-to-end automation in a reliable demo flow.

---

## 3) End-to-End Workflow (MVP)

### Worker Flow
1. **Auth** (OTP) → JWT
2. Profile setup + GPS permissions
3. Risk score shown + premium tier explained
4. Buy weekly policy (mock payment)
5. Claims history + payout status tracking
6. Financial tracker: Total Premium Paid, Total Payout Received, Net Benefit

### Admin Flow
1. View KPIs + claims table + fraud flags
2. Trigger event (God Mode)
3. Review claims and override fraud-flagged cases (Approve/Reject)


<img width="839" height="475" alt="image" src="https://github.com/user-attachments/assets/711df0a3-14db-4869-ae38-a3eb3e6b6e47" />

---

## 4) Weekly Premium Model (How Pricing Works)

### Why Weekly?
Gig income is daily/weekly; weekly plans:
- are affordable (₹15–₹35/week),
- match short-term uncertainty (weather volatility),
- fit hackathon scope.

### Risk Score → Premium Tier Mapping
Risk score is computed as **0–100** and mapped to:

| Risk Score | Tier | Premium (₹/week) | Max Cover (₹) |
|-----------:|------|------------------:|--------------:|
| 0–33 | Low | 15 | 1000 |
| 34–66 | Medium | 25 | 2000 |
| 67–100 | High | 35 | 3000 |

### Premium Explanation (UX)
The worker UI shows reasons behind pricing as bullet points:
- “Frequent heavy rain expected”
- “High AQI trend”
- “Congestion index elevated”
(Generated from the risk engine output fields.)

---

## 5) Parametric Triggers (Objective, Automatic)

The platform triggers payout evaluation when thresholds cross:

- **Heavy Rain:** precipitation **> 15 mm/hour**
- **Heatwave:** temperature **> 42°C**
- **Pollution:** AQI **> 450** (“Severe Plus”)
- **Traffic/Lockdown / Curfew:** average speed **< 5 km/hr** for **> 1 hour** OR Admin manual trigger

These triggers are designed to be:
- measurable from external APIs,
- easy to justify to users,
- automatable without manual claims.

---

## 6) Payout Calculation (Parametric Formula)

When an event affects a covered worker:

- **Hourly_Rate = avg_daily_income / working_hours**
- **Disruption_Duration_Hours = Event_End_Time - Event_Start_Time**
- **Total_Payout = Hourly_Rate × Disruption_Duration_Hours**
- Constraint: payout cannot exceed the policy’s **coverage_limit** for that week.

---

## 7) AI/ML Integration Plan (MVP + Next Steps)

### 7.1 Risk & Premium Engine (AI-assisted pricing)
**MVP approach (hackathon):**
- Weighted scoring model (fast + deterministic) producing Risk_Score (0–100).
- Inputs (example):
  - recent/historical rainfall (zone)
  - AQI trend
  - traffic congestion index
  - active user hours / demand signals

**Post-MVP:**
- Replace weights with trained ML model (e.g., XGBoost / scikit-learn pipeline).
- Train with historical weather + claims outcomes to calibrate risk and premiums.

### 7.2 Fraud Detection Engine
**Rules-based MVP (fast + explainable):**
- GPS spoofing / mismatch: last ping > 10 km from event zone
- Duplicate claim: worker already paid for same event_id
- Trust score low: trust_score < 40 flags claim for review

**Post-MVP:**
- Add anomaly detection:
  - suspicious mobility patterns
  - repeated near-boundary location pings
  - payout frequency clustering
- Use ML scoring to produce a fraud risk probability + explanations.

---

## 8) Why Mobile for Workers + Web for Admin (Platform Justification)

### Worker App: React Native (Mobile)
- Gig workers operate in the field; mobile is natural.
- Required features are mobile-first:
  - OTP login
  - GPS permissions and continuous location pings
  - push notifications for disruption alerts & payouts
  - map view + heatmap overlay

### Admin Dashboard: Next.js (Web)
- Admin tasks are monitoring-heavy:
  - tables, charts, override actions
  - demo controls (“God Mode”)
- Web is faster to iterate and ideal for hackathon judging.

---

## 9) Tech Stack

### Frontend (Worker App)
- React Native + Expo
- Mapbox (heatmap overlay)
- Push notifications (Expo Notifications or FCM)
- Razorpay Test Mode (mock payment)

### Frontend (Admin Dashboard)
- Next.js
- Tailwind CSS
- Recharts (analytics)

### Backend
- FastAPI (Python)
- PostgreSQL + PostGIS (zones, geo queries)
- Celery + Redis (background polling, bulk payout processing)

---

## 10) Development Plan (24–48 Hour Hackathon)

### Phase 1 (Hours 0–8): Foundation
- Backend: FastAPI skeleton + PostgreSQL tables (Users, Policies)
- Worker app: OTP login + profile screen
- Admin web: dashboard scaffolding + layout

### Phase 2 (Hours 8–16): The Core Loop
- Pricing engine endpoint: risk score → tier → premium
- Policy purchase endpoint (mock payment) + 7-day policy issuance
- Parametric trigger engine:
  - create event
  - find matching active policies in zone
  - compute payout + create claim

### Phase 3 (Hours 16–24): Wow Factor / Integration
- Admin “Trigger Disruption” panel wired to backend
- Worker UI updates for claim history + payout status
- Push notification (or realtime mock) on payout status
- Mapbox heatmap (optional if time permits)

---

## 11) Repository & Deliverables

### Deliverable 1: The Idea Document
This `README.md` is the concise idea document covering:
- persona-based scenarios + workflows,
- weekly premium model,
- parametric triggers,
- AI/ML integration approach,
- stack + development plan.

### Deliverable 2: Git Repository Link
Add your repository link here:
- **Repo:** `<PASTE YOUR GITHUB/GITLAB LINK HERE>`

---

## 12) API Contract (MVP Reference)

- `POST /api/auth/verify-otp` → JWT Token  
- `GET /api/worker/{id}/risk-profile` → Risk Score, Premium Tiers, Reasons  
- `POST /api/policy/purchase` → `{user_id, tier, amount}`  
- `GET /api/worker/{id}/dashboard` → Active policy, weather, financial totals  
- `GET /api/claims/history/{user_id}` → Past claims list  
- `POST /api/admin/trigger-disruption` → `{event_type, location, duration_hours}`

---

## 13) What’s Next (Beyond MVP)
- Real external API integrations (weather, AQI, traffic)
- Stronger ML pricing calibration
- Real payout rails integration + reconciliation
- More robust fraud ML + audit logs
- Policy lifecycle management + renewals + refunds (if needed)


---


## 📄 Product Requirements Document (PRD)

Detailed PRD available for this project.  
Please visit the link below for complete understanding:

👉 <a href="https://gist.github.com/Pratyakshgupta887qwert/448847af9928fb5a6ce2cdeaad89b374">Link to Look over</a>
---
