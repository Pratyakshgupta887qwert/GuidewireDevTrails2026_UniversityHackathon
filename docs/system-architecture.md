# System Architecture

This document describes the high-level architecture of the AI-Powered Parametric Insurance Platform for Gig Workers.

The system is designed to automatically detect external disruptions (such as extreme weather or curfews) and trigger insurance payouts without requiring manual claims.

The architecture is divided into several main components to ensure scalability, automation, and clear separation of responsibilities.

## 1. Platform Components

The platform consists of the following major components:

1. Worker Application

2. Admin Dashboard

3. Backend Services

4. Worker Processing Services

5. External Integrations

6. Database Layer

Each component works together to provide automated policy management, disruption detection, fraud prevention, and payout processing.

## 2. Worker Application

The Worker Application is the primary interface used by gig workers.

### Responsibilities

The application allows workers to:

- Register and authenticate using OTP login

- Create and manage their worker profile

- View risk score and insurance premium options

- Purchase a weekly insurance policy

- Receive notifications about disruption events

- Track claim status and payouts

### Key Features

- Mobile-first design suitable for delivery workers

- GPS location permission for location validation

- Dashboard displaying active policy and earnings protection

- Claim history and payout tracking

This component focuses on simplicity and accessibility, since most users interact with the platform while working in the field.

## 3. Admin Dashboard

The Admin Dashboard is a web interface used by platform administrators to monitor system activity and manage operations.

### Responsibilities

Admins can:

- Monitor platform analytics and performance metrics

- View active workers and policies

- Review claims and potential fraud alerts

- Trigger simulated disruption events for demonstrations or testing

### Key Metrics Displayed

The dashboard provides insights such as:

- Total registered workers

- Active insurance policies

- Total premium collected

- Total payouts issued

- Claims statistics and trends

The Admin Dashboard enables administrators to maintain operational oversight and monitor platform performance.

## 4. Backend Services

Backend services handle the core logic of the platform and manage interactions between system components.

### Responsibilities

The backend is responsible for:

- Authentication and user management

- Worker profile management

- Risk scoring and premium calculation

- Policy creation and lifecycle management

- Claim validation and fraud checks

- Communication with external services

### Key Backend Modules

#### Authentication Service
Handles worker authentication using OTP verification and generates secure access tokens.

#### Policy Management Service
Responsible for creating and managing weekly insurance policies, including tracking policy validity and coverage limits.

#### Risk & Premium Engine
The Risk & Premium Engine evaluates environmental and geographic risk factors to determine the worker's risk score and corresponding weekly premium.

Risk scoring considers multiple factors such as:

- Historical weather disruption frequency

- Pollution levels

- Traffic congestion patterns

- Zone-based disruption probability

The risk score ranges from 0 to 100 and determines the premium tier offered to the worker.

| Risk Score | Tier | Weekly Premium | Coverage Limit |
|------------|------|---------------|---------------|
| 0 – 33 | Low Risk | ₹15 | ₹1000 |
| 34 – 66 | Medium Risk | ₹25 | ₹2000 |
| 67 – 100 | High Risk | ₹35 | ₹3000 |

The selected tier defines the maximum payout limit that a worker can receive during the active weekly policy period.

### Fraud Detection Module

This module checks for suspicious claim behavior using rules such as:

- GPS mismatch with disruption zone
- Duplicate claim detection
- Unusual claim frequency
- 
These checks help ensure the integrity of automated claim payouts.

## 5. Worker Processing Services

Worker Processing Services run background jobs that automate disruption detection and claim processing.

These services operate asynchronously to monitor external data sources and process events affecting workers.

### Responsibilities

Worker services perform the following tasks:

- Monitor external disruption triggers

- Identify affected geographic zones

- Find active policies within the impacted area

- Evaluate eligible claims

- Calculate payout amounts

- Record claim results and notify workers

### Automated Claim Evaluation

When a disruption event occurs, the system automatically evaluates eligible workers.

The payout calculation is based on the worker's average income and the duration of the disruption.

### Payout Calculation

The payout is calculated based on the worker’s average earnings and the duration of the disruption event.

#### Step 1 — Calculate hourly income

Hourly_Rate = Avg_Daily_Income / Working_Hours

#### Step 2 — Calculate disruption duration

Disruption_Duration = Event_End_Time - Event_Start_Time

#### Step 3 — Calculate compensation

The system compensates 75% of the worker’s lost income during the disruption.

Payout = Hourly_Rate × Disruption_Duration × 0.75

The payout amount cannot exceed the coverage limit defined in the worker’s weekly insurance policy.

### Example

Average Daily Income = ₹800
Working Hours = 8

Hourly_Rate = 800 / 8 = ₹100

If disruption lasts 4 hours:

Lost Income = 100 × 4 = ₹400

Compensation (75%)

Payout = 400 × 0.75 = ₹300

## 6. External Integrations

The platform integrates with external data providers to detect real-world disruptions affecting gig workers.

Examples include:

- Weather data services for rainfall and temperature monitoring

- Air quality services for pollution detection

- Traffic or mobility data providers for road congestion and movement restrictions

- Payment systems used to simulate or process payouts

These integrations allow the system to identify objective disruption events and automatically trigger insurance claim processing.

## 7. Data Flow

The typical system workflow follows these steps:

### Step 1 — Worker Registration

A worker registers through the mobile application and creates a profile with personal and work-related information.

### Step 2 — Risk Assessment

The backend evaluates environmental and geographic factors to generate a risk score.

### Step 3 — Policy Purchase

The worker purchases a weekly insurance policy based on the calculated premium tier.

### Step 4 — Disruption Detection

External data sources or admin triggers detect disruption events such as heavy rain or extreme pollution.

### Step 5 — Claim Evaluation

The system identifies workers with active policies in the affected zones and runs fraud detection checks.

### Step 6 — Automated Payout

If the claim is valid, the system calculates the payout amount and records the transaction.

### Step 7 — Worker Notification

The worker receives a notification showing the payout and updated claim history.

## 8. Architecture Goals

The architecture is designed with the following objectives:

- Automation — disruption events trigger claims automatically

- Scalability — capable of supporting large numbers of gig workers

- Transparency — clearly defined triggers and payout rules

- Security — fraud detection and location validation mechanisms
