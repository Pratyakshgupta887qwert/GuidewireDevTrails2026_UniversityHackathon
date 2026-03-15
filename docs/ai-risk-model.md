## AI Risk Model

This document describes the risk modelling logic used in the AI-Powered Parametric Insurance Platform for Gig Workers.

The purpose of the AI risk model is to estimate the likelihood of disruption events that may affect worker income and to determine appropriate insurance premiums.

The system currently uses a rule-based risk scoring model designed for reliability and explainability. The architecture also allows future integration of machine learning models for more advanced prediction.

---

### Disruption Prediction Logic

The platform continuously monitors environmental and mobility signals to identify disruptions that may impact gig workers.

Disruptions are detected when specific thresholds are exceeded.

Examples of disruption conditions include:

- **Heavy Rain**
- **Extreme Heat**
- **Severe Air Pollution**
- **Traffic or mobility restrictions**
- **Curfews or restricted movement zones**

Example trigger thresholds:

| Disruption Type | Condition |
|---|---|
| Heavy Rain | Rainfall > 15 mm/hour |
| Heatwave | Temperature > 42°C |
| Pollution | AQI > 450 |
| Traffic Restriction | Average road speed < 5 km/h for more than 1 hour |

When a disruption condition is detected, the system generates a **disruption event** which triggers the automated claim evaluation process.

---

### Risk Score Calculation

Each worker is assigned a **Risk Score between 0 and 100** based on environmental and geographic factors.

The risk score estimates the likelihood that the worker's income will be affected by disruptions.

Risk score factors include:

- historical weather disruption frequency
- pollution trends in the worker's zone
- traffic congestion patterns
- historical disruption events in the region
- worker activity patterns

A simplified risk scoring formula can be represented as:

```
Risk Score =
0.4 × Weather Risk +
0.3 × Pollution Risk +
0.2 × Traffic Risk +
0.1 × Historical Disruption Risk
```

The calculated risk score determines the worker's premium tier.

---

### Premium Pricing Logic

Insurance premiums are calculated based on the worker's assigned risk score.

Workers are grouped into risk tiers that determine both their weekly premium and coverage limit.

| Risk Score | Tier | Weekly Premium | Coverage Limit |
|---|---|---|---|
| 0 – 33 | Low Risk | ₹15 | ₹1000 |
| 34 – 66 | Medium Risk | ₹25 | ₹2000 |
| 67 – 100 | High Risk | ₹35 | ₹3000 |

This tier-based pricing ensures that workers operating in higher risk zones contribute proportionally to the insurance pool.

---

### Model Inputs

The risk model relies on multiple data sources to evaluate disruption probability.

Key input signals include:

- Weather data (rainfall, temperature)
- Air quality data (AQI levels)
- Traffic and mobility data
- Geographic zone information
- Worker historical activity patterns
- Historical disruption frequency

These inputs are periodically updated and processed by the risk evaluation service.

---

### Fraud Risk Signals

The risk model also considers fraud detection signals when evaluating claims.

Examples include:

- Worker GPS mismatch with disruption zone
- Duplicate claim attempts
- Unusual claim frequency
- Suspicious location patterns

Claims flagged with abnormal signals are passed to the **fraud detection service** for additional validation.

---
### AI Model Usage in the Platform

The AI risk model is integrated into the backend risk evaluation service and is used during policy creation and disruption analysis.

The model is used in two key stages of the system:

#### 1. Worker Risk Assessment

When a worker registers or requests to purchase a policy:

1. Worker profile data is collected.
2. Environmental data for the worker's operating zone is retrieved.
3. These inputs are passed to the risk evaluation model.
4. The model calculates a **risk score (0–100)**.
5. The risk score determines the worker's **premium tier and coverage limits**.

This allows the system to dynamically price insurance policies based on real-world risk conditions.

#### 2. Disruption Impact Analysis

When a disruption event is detected:

1. The system identifies affected geographic zones.
2. Workers operating in those zones are retrieved.
3. Risk signals are evaluated to determine disruption severity.
4. The claim processing service calculates eligible payouts.

This ensures that claims are processed automatically based on verified environmental disruptions.

---

### Model Execution Flow

The AI risk model operates within the backend service pipeline:

Worker Registration → Risk Model Evaluation → Risk Score Generation → Premium Tier Assignment → Policy Creation

During disruption events:

Disruption Detection → Worker Zone Identification → Claim Processing → Payout Calculation
### Future Machine Learning Extensions

While the current implementation uses rule-based risk scoring, the system architecture supports future integration of machine learning models.

Possible ML extensions include:

- disruption prediction using historical weather data
- zone-based income risk forecasting
- anomaly detection for fraud identification
- adaptive premium pricing models

Machine learning models such as **XGBoost, Random Forest, or Neural Networks** could be trained using historical disruption and claim datasets.

This would enable more accurate risk estimation and dynamic premium adjustments over time.
