# Extraction-tool

A high-performance full-stack web application designed to extract **Domain Names** and **IPv4 Addresses** from any raw text.

## 🚀 Features

- **Intelligent Domain Extraction**:
    - Supports "Root Domains Only" (e.g., `sub.example.com` → `example.com`).
    - Supports "Full Domains" (e.g., `sub.example.com` stays).
    - Uses the **Public Suffix List** for accurate root domain identification (properly handles `.co.uk`, `.com.br`, etc.).
    - Automatically strips protocols (`http://`, `https://`) and email prefixes (`user@`).
- **IPv4 Extraction**:
    - Validates octets (0-255).
    - Removes duplicates.
- **Premium UI**:
    - Modern Glassmorphism design.
    - Responsive layout.
    - Live-updating counts.
    - One-click copy and .txt download.
- **Fast Backend**: Node.js + Express with regex optimization.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Tailwind CSS v3 (via CDN), Vanilla JavaScript.
- **Backend**: Node.js, Express, `psl` (Public Suffix List).
- **Deployment**: Optimized for Vercel Serverless Functions.

## 💻 Local Development

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   The backend will run on `http://localhost:3000`.

2. **Frontend**:
   Simply open `frontend/index.html` in your browser or use a live server.

## 📦 Deployment to Vercel

1. Install the Vercel CLI: `npm i -g vercel`.
2. Run `vercel` in the root directory.
3. The `vercel.json` file is already configured to route requests correctly.

## 🔍 API Endpoints

- `POST /api/extract/domains`: Body `{ "text": "...", "mode": "root" | "full" }`
- `POST /api/extract/ips`: Body `{ "text": "..." }`
- `POST /api/extract/both`: Body `{ "text": "...", "mode": "root" | "full" }`

---
Built with ❤️ by Antigravity.
