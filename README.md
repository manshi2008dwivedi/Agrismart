# AgriSmart — Smart Agriculture, Mandi Marketplace & Advisory Platform

AgriSmart is an end-to-end, production-ready smart agriculture web platform connecting Indian farmers with direct buyers, offering live weather intelligence, dynamic mandi market rates, AI-driven soil & fertilizer recommendations, crop disease diagnosis, direct negotiation, and order settlement tracking.

---

## 🚀 Quick Deployment Guide

### Option 1: One-Click Cloud Deployment (Render)
1. Fork or push this repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New + > Blueprint**.
3. Select your repository. Render will automatically read [`render.yaml`](./render.yaml).
4. *(Optional)* Set `GEMINI_API_KEY` in the environment settings if using live Gemini AI advisory.
5. Click **Apply**. Your app will be live with auto-SSL and health checks enabled!

### Option 2: Docker Deployment (AWS ECS, GCP Cloud Run, DigitalOcean, VPS)
```bash
# 1. Build the Docker image
docker build -t agrismart:latest .

# 2. Run container in production mode
docker run -d \
  --name agrismart \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e ALLOW_DEV_OTP=false \
  -v agrismart-data:/app/backend/data \
  --restart unless-stopped \
  agrismart:latest
```

### Option 3: Standard Cloud / PaaS (Railway, Heroku, Fly.io)
- **Railway**: Connect GitHub repository; Railway automatically detects `Dockerfile` or `Procfile` and assigns a public HTTPS URL.
- **Heroku / Dokku**: The repository includes a `Procfile` (`web: node backend/server.js`).

### Option 4: Linux VPS (Ubuntu / Debian + Systemd + Nginx)
1. Clone the project to `/var/www/agrismart`:
   ```bash
   git clone <repo_url> /var/www/agrismart
   cd /var/www/agrismart
   ```
2. Copy and configure environment variables:
   ```bash
   cp .env.example .env
   ```
3. Create a systemd service file at `/etc/systemd/system/agrismart.service`:
   ```ini
   [Unit]
   Description=AgriSmart Fullstack Service
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/agrismart
   ExecStart=/usr/bin/node backend/server.js
   Restart=always
   Environment=NODE_ENV=production PORT=3000

   [Install]
   WantedBy=multi-user.target
   ```
4. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now agrismart
   ```
5. Point Nginx reverse proxy to `http://127.0.0.1:3000` with `proxy_set_header X-Forwarded-For $remote_addr;`.

### Option 5: Local Windows / macOS
- **Windows**: Double-click `start.bat` or run:
  ```powershell
  npm start
  ```
- **Linux / macOS**:
  ```bash
  chmod +x start.sh
  ./start.sh
  ```
- Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Testing & Verification

Run the comprehensive automated test suite (verifying 30+ endpoints, security policies, and edge cases):
```bash
npm test
```

Liveness & health check probe:
```bash
curl http://localhost:3000/api/health
```

---

## 🔒 Security & Architecture Features

- **Constant-Time OTP Authentication**: OTP verification uses `crypto.timingSafeEqual` with a 5-attempt brute-force lockout.
- **Production Mode Safeguards**: `devOtp` is automatically omitted from HTTP responses when `NODE_ENV=production`.
- **Cross-Platform Path Traversal Protection**: Multi-layer sanitization preventing directory escape outside `frontend/`.
- **HTTP Security Headers**: Strict CSP policy (supporting Leaflet & Open-Meteo), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `Strict-Transport-Security`.
- **Stored XSS Prevention**: Context-aware HTML entity encoding on all user-supplied inputs and marketplace tables.
- **Graceful Shutdown**: Handles `SIGTERM` and `SIGINT` signals by finishing queued file writes before closing.
- **Zero-Dependency Core**: The backend runs purely on Node.js standard libraries (`http`, `crypto`, `fs`, `path`).

---

## ⚙️ Environment Variables Reference

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `3000` | Port for the HTTP server |
| `HOST` | `0.0.0.0` | Host address binding |
| `NODE_ENV` | `development` | Set to `production` for production deployments |
| `ALLOW_DEV_OTP` | `false` (in prod) | When true, includes generated OTP in response for test automations |
| `FRONTEND_ORIGIN`| *(all local)* | Whitelisted domain for CORS |
| `TRUSTED_PROXIES`| `false` | Enable only if behind a verified reverse proxy like Cloudflare/Nginx |
| `GEMINI_API_KEY` | *(empty)* | Optional API key for Google Gemini AI advisory engine |
| `DATA_PATH` | `backend/data/db.json`| Absolute or relative path to persist database file |
| `PUBLIC_DIR` | `frontend/` | Absolute or relative path for static UI assets |
