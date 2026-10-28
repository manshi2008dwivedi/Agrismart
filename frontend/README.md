# AgriSmart — fixed full-stack project

This version keeps the original AgriSmart visual format and fixes the main prototype issues:

- Secure account registration/login with server-side sessions and password hashing
- Farmer and buyer authorization; browser localStorage IDs are no longer trusted
- Farmer offers are private to the authenticated farmer
- Accepted offers automatically create orders
- Buyer/farmer notifications are stored in the backend
- Payment and delivery status fields are tracked in orders
- Farm profitability reports are validated and stored per account
- 7-day weather forecast is displayed
- Crop recommendation cards now use backend crop data and have working details
- PWA service-worker registration is included
- API body-size limits, rate limiting, validation, security headers and safer CORS defaults
- Serialized JSON writes reduce concurrent-write corruption for local/demo use

## Run on Windows

1. Install Node.js 18+ (Node 20+ recommended).
2. Double-click `start.bat` in this folder, or run `node backend/server.js`.
3. Open `http://localhost:3000`.
4. Create a Farmer or Buyer account from **Login / Register**.

## Important data note

The project still uses `backend/data/db.json` so it can run with zero external database dependencies. This is appropriate for a college/demo project and local testing, but a high-traffic production deployment should move the same data model to PostgreSQL/MySQL.

The mandi prices are still a clearly labelled **demo/local dataset**. A live government/market feed requires an appropriate provider/API and credentials, so the project does not pretend that the bundled sample values are live prices.

Weather uses Open-Meteo when internet access is available.

## Main API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/health`
- `GET /api/crops`
- `GET /api/mandis`
- `GET /api/mandis/prices?crop=wheat`
- `GET /api/weather?district=Sehore`
- `GET /api/locations`
- `GET /api/farmers` (public marketplace directory)
- `GET /api/farmers/mine` (authenticated farmer)
- `POST /api/farmers` (authenticated farmer)
- `GET /api/offers` (authenticated, role-scoped)
- `POST /api/offers` (buyer)
- `PUT /api/offers/:id` (owner farmer)
- `GET /api/orders`
- `PATCH /api/orders/:id`
- `GET /api/notifications`
- `PATCH /api/notifications/read`
- `GET /api/reports`
- `POST /api/reports`

## Production next step

For public deployment, replace the JSON store with PostgreSQL, set `FRONTEND_ORIGIN` to the exact frontend origin, use HTTPS, add a payment provider and real mandi data provider, and put the Node server behind a reverse proxy.
