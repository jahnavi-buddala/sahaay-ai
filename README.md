# Sahaay AI (సహాయ్ AI)
### *"Predict. Prevent. Protect."*

> **Civic Road Hazard & Urban Flood Intelligence Platform**  
> Built for Indian commuters, ward officials, and disaster response teams to report road hazards, verify visual evidence with computer vision, query meteorological ground truth, and choose safer alternative travel corridors.

---

## 🎨 Design System & Palette

Sahaay AI uses a soft, transparent, minimal, civic-tech and weather-dashboard design system:

| Token | Hex / Value | Semantic Role |
|---|---|---|
| **Primary** | `#8FAF9A` | Muted sage green — primary action buttons, active tabs |
| **Secondary** | `#A8D5CE` | Soft teal — corroboration badges, subtle gradients |
| **Background** | `#F8FAF8` | Warm off-white — minimal backdrop |
| **Card Surface** | `rgba(255, 255, 255, 0.88)` | Translucent white cards with subtle border & backdrop blur |
| **Main Text** | `#25332F` | Deep charcoal — accessible high contrast |
| **Secondary Text**| `#718078` | Muted gray-green — metadata, timestamps, helper notes |
| **Borders** | `#E3EBE5` | Light sage dividers and inputs |
| **Accent Sky** | `#DCECF5` | Pale sky blue — weather context and resolution indicators |
| **Low Concern** | `#5F8B6F` | Muted green (0–29 evidence score) |
| **Caution** | `#F5D99A` | Soft amber (30–59 evidence score) |
| **Elevated Concern** | `#E9A49A`| Muted coral (60–100 evidence score) |

---

## 🚀 Key Features

1. **4-Step Guided Reporting Flow (`/report`)**:
   - Step 1: Drag-and-drop or tap-to-upload photo with live preview and validation.
   - Step 2: Interactive Leaflet map with draggable pin, address search, and "Use My GPS".
   - Step 3: Hazard classification, reporter description, severity observation, and anonymous preference.
   - Step 4: Summary review and instant backend submission with automated AI analysis.
2. **AI-Assisted Computer Vision Analysis**:
   - `Sahaay-CV-EdgeNet-v1` feature extractor calculating specular reflectance ratio, surface uniformity, and flood turbidity signatures.
   - Documented limitations: camera perspective cannot measure physical water depth; lighting reflections do not establish roadbed stability.
3. **Interactive Hazard Map (`/map`)**:
   - Leaflet + OpenStreetMap cartography with custom status-coded markers.
   - Responsive sidebar list, status filtering, and click-to-center popup preview.
4. **Explainable 0–100 Risk Score**:
   - Configurable formula: Visual Evidence (0–30), Corroborating Reports (0–25), Rainfall Context (0–20), Report Freshness (0–15), and Location Quality (0–10).
5. **Live Weather Integration**:
   - Open-Meteo REST API queries precipitation rate, 6-hour rainfall forecasts, and rain probability with 15-minute caching.
6. **Bilingual Alert Generation (`en` & `te` - తెలుగు)**:
   - English and Telugu interface toggle.
   - One-click copyable WhatsApp / SMS civic alert cards.
7. **Alternative Route Comparison**:
   - OSRM driving engine evaluates candidate routes crossing hazard buffers (350m) and recommends safer bypass corridors with distance and duration metrics.
8. **Civic Admin Dashboard (`/admin`)**:
   - Live metrics, community triage queue, status transitions (Verified, Corroborated, Resolved, Stale), duplicate incident merging, and audit logs.

---

## 📂 Project Architecture

```
Sahaay AI/
├── backend/
│   ├── .venv/                      # Python 3.11 virtual environment
│   ├── main.py                     # FastAPI REST API & endpoints
│   ├── database.py                 # SQLAlchemy engine & session factory
│   ├── models.py                   # Report, User, AuditLog models
│   ├── seed_data.py                # Curated seed incidents (is_demo_data=True)
│   ├── create_demo_images.py       # Sample evidence generator
│   ├── services/
│   │   ├── vision_service.py       # CV image feature extractor
│   │   ├── weather_service.py      # Open-Meteo weather integration & cache
│   │   ├── risk_service.py         # 0-100 explainable risk scorer
│   │   ├── duplicate_service.py    # Haversine spatial duplicate clustering
│   │   └── routing_service.py      # OSRM route comparison engine
│   └── uploads/                    # Persisted road photograph storage
├── frontend/
│   ├── src/
│   │   ├── components/             # Navbar, Footer, RiskBadge, StatusBadge, LocationPicker, etc.
│   │   ├── contexts/               # AuthContext, LanguageContext (en/te)
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── ReportPage.tsx
│   │   │   ├── MapPage.tsx
│   │   │   ├── IncidentsPage.tsx
│   │   │   ├── IncidentDetailPage.tsx
│   │   │   ├── MyReportsPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   └── admin/              # Overview, Incidents, ReviewQueue, Analytics, Settings
│   │   ├── services/api.ts         # Type-safe API client
│   │   └── types/index.ts          # TypeScript interfaces
│   └── vite.config.ts              # Vite + Tailwind CSS + API Proxy
├── .env.example
└── README.md
```

---

## ⚡ Quick Start & Run Commands

### Prerequisites
- Node.js v18+ (Node v24 tested)
- Python 3.10+ (managed via `uv` or system Python)

### 1. Run Backend Server (FastAPI)
```bash
cd backend
# Activate virtual environment:
# Windows: .\.venv\Scripts\activate
# Linux/Mac: source .venv/bin/activate

uvicorn main:app --host 127.0.0.1 --port 8000
```
Backend API will be accessible at: `http://127.0.0.1:8000`  
Interactive Swagger docs: `http://127.0.0.1:8000/docs`

### 2. Run Frontend Web App (React + Vite)
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
Frontend Web Application: `http://127.0.0.1:5173`

---

## 🛡️ Hackathon Demo Walkthrough Guide

To evaluate the core end-to-end user story:

1. **Open Landing Page**: Visit `http://127.0.0.1:5173`
   - Toggle language between **EN** and **తెలుగు** in the top navigation bar.
2. **Submit a New Hazard Report**: Click **"Report a Hazard"**
   - Step 1: Upload an image or use text-only submission.
   - Step 2: Open the interactive map, search a landmark or drag the marker pin.
   - Step 3: Select "Waterlogging", enter a description, and select observed severity.
   - Step 4: Click "Submit Report". Notice the real-time AI computer vision analysis and Open-Meteo weather context attached with an incident reference ID (e.g. `SHY-...`).
3. **Explore on Live Map**: Click **"Live Map"**
   - Filter by hazard type or status. Click any pin to open popup preview and navigate to full details.
4. **Inspect Incident Dossier**: Open an incident (e.g., `SHY-HYD-001` or newly submitted report)
   - Review AI Visual Evidence (confidence %, predicted labels, limitations).
   - Review 0–100 Explainable Risk Score breakdown.
   - Compare Candidate Route A (Direct) vs Candidate Route B (Bypass).
   - Click "Copy Alert Message" to copy formatted WhatsApp/SMS broadcast text in English or Telugu.
5. **Switch to Admin Officer Persona**:
   - Click the user profile icon in the navbar → click **🛡️ Admin Officer** (quick demo login: `admin@sahaay.org` / `admin123`).
   - Navigate to `/admin`: inspect live counts, weekly trends, triage review queue, and resolve or corroborate reports.
