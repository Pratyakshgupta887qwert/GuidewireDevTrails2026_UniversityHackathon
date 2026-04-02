## API Reference

This document describes the API endpoints used in the **AI-Powered Parametric Insurance Platform for Gig Workers**.

The APIs allow communication between the **Worker Application**, **Admin Dashboard**, and **Backend Services**.

The backend APIs follow a **RESTful architecture** and exchange data in **JSON format**.

---

### Technology Stack

The backend APIs are implemented using the following technologies:

- **FastAPI (Python)** — backend API framework
- **PostgreSQL + PostGIS** — database and geospatial queries
- **Redis / Celery** — background task processing
- **JWT Authentication** — secure API access
- **Mock APIs** — simulated integrations for external services such as weather, traffic, and payment processing

External services are mocked during development to simulate real-world disruption detection and payout flows.

---

### Authentication Endpoints

These endpoints handle worker authentication and secure access to the platform.

| Method | Endpoint | Description |
|------|------|-------------|
| POST | /api/auth/send-otp | Send OTP to worker phone number |
| POST | /api/auth/verify-otp | Verify OTP and generate authentication token |

Example request:

```
POST /api/auth/send-otp
```

Example response:

```
{
  "message": "OTP sent successfully"
}
```

---

### Worker Endpoints

Worker endpoints manage worker profiles and dashboard data.

| Method | Endpoint | Description |
|------|------|-------------|
| GET | /api/worker/profile | Get worker profile details |
| PUT | /api/worker/profile | Update worker information |
| GET | /api/worker/dashboard | Fetch worker dashboard data |
| GET | /api/worker/risk-score | Retrieve worker risk score |

Example response:

```
{
  "worker_id": "123",
  "name": "Rahul",
  "platform": "Swiggy",
  "risk_score": 48
}
```

---

### Policy (Insurance) Endpoints

These endpoints allow workers to view and purchase insurance policies.

| Method | Endpoint | Description |
|------|------|-------------|
| GET | /api/policies | Get available policy tiers |
| POST | /api/policies/purchase | Purchase weekly insurance policy |
| GET | /api/policies/active | Retrieve active policy for worker |
| GET | /api/policies/history | Retrieve past policies |

Example purchase request:

```
POST /api/policies/purchase
```

```
{
  "worker_id": "123",
  "tier": "medium"
}
```

---

### Claim Endpoints

These endpoints manage insurance claims generated from disruption events.

| Method | Endpoint | Description |
|------|------|-------------|
| GET | /api/claims | Retrieve worker claim history |
| GET | /api/claims/{claim_id} | Retrieve specific claim details |
| POST | /api/claims/process | Trigger claim evaluation (internal use) |

Example response:

```
{
  "claim_id": "CLM001",
  "payout_amount": 300,
  "status": "approved"
}
```

---

### Admin Endpoints

Admin endpoints allow administrators to monitor system activity and simulate disruption events.

| Method | Endpoint | Description |
|------|------|-------------|
| GET | /api/admin/dashboard | Retrieve platform analytics |
| GET | /api/admin/claims | View all claims |
| POST | /api/admin/trigger-disruption | Simulate disruption event |
| GET | /api/admin/workers | View registered workers |

Example request:

```
POST /api/admin/trigger-disruption
```

```
{
  "event_type": "heavy_rain",
  "zone": "Delhi",
  "duration_hours": 3
}
```

---

### External APIs (Mocked Integrations)

To simulate real-world disruption events, the system integrates with external APIs.  
During development and testing, these APIs are mocked to ensure consistent demo behaviour.

| API Provider | Purpose |
|---|---|
| **OpenWeatherMap API** | Detect rainfall, storms, and extreme temperatures |
| **AQICN API** | Monitor air quality index (AQI) levels |
| **Google Maps Traffic API** | Detect traffic congestion and mobility restrictions |
| **Razorpay Sandbox API** | Simulate payout transactions to workers |

Example weather API request:

```
GET https://api.openweathermap.org/data/2.5/weather
```

Example AQI API request:

```
GET https://api.waqi.info/feed/{city}/
```

Example payout request (sandbox):

```
POST https://api.razorpay.com/v1/payouts
```

These APIs provide environmental and payment signals that help the platform detect disruptions and automate claim processing.

---
### API Security

The APIs are secured using **JWT-based authentication**.

Key security practices include:

- Token-based authentication
- Role-based access control for admin endpoints
- Input validation for API requests
- Rate limiting for authentication endpoints

All API responses follow a **standard JSON response format** to ensure consistency across the platform.
