# AegisAI Frontend

Worker-facing web UI for policy, claims, and risk monitoring.

## Run

```bash
cd frontend
npm install
npm run dev
```

Default URL: `http://localhost:5173`

## API Integration

Frontend expects backend at `http://localhost:8000/api` by default.

Override API base URL if needed:

```bash
set VITE_API_BASE_URL=http://localhost:8000/api
```

## Build

```bash
npm run build
```
