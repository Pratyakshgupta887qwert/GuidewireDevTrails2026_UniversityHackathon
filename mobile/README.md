# AegisAI Mobile (Expo + WebView)

This mobile app is a WebView wrapper for the frontend web app.

## Run with Expo Go

1. Install mobile dependencies:

```bash
npm install
```

2. Start the frontend web app (in `frontend`):

```bash
npm run dev -- --host
```

3. Set web app URL for mobile (in `mobile`):

```bash
$env:EXPO_PUBLIC_WEB_URL="http://<YOUR_LAPTOP_IP>:5173"
```

Example:

```bash
$env:EXPO_PUBLIC_WEB_URL="http://192.168.1.10:5173"
```

4. Start Expo:

```bash
npx expo start
```

5. Scan QR in Expo Go and open app.

## Notes

- Phone and laptop must be on same Wi-Fi.
- If `EXPO_PUBLIC_WEB_URL` is not set, app tries to auto-detect host from Expo and fallback URLs.
- Default web app port expected by mobile wrapper: `5173`.
- Optional: set `EXPO_PUBLIC_WEB_PORT` if your frontend runs on a different port.
