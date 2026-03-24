# AegisAI Backend

Minimal FastAPI backend for worker, policy, claims, and live risk signals.

## Run

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## API Endpoints

- `GET /` health check
- `GET /api/workers/me`
- `GET /api/policies`
- `GET /api/policies/{policy_id}`
- `POST /api/policies/{policy_id}/renew`
- `GET /api/claims`
- `GET /api/claims/payout-rules`
- `GET /api/risk/live?latitude=28.6139&longitude=77.2090`

## CORS

By default CORS allows all origins. Override with:

```bash
set CORS_ORIGINS=http://localhost:5173,http://192.168.0.102:5173
```
