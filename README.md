# Golden Hour — Intelligent Emergency Response & Coordination Platform

## 🏆 Hackathon
**1st Place: Crisis to Creation (October 2026)**

Live demo: https://roadacc.vercel.app/

Original repository: https://github.com/vaanavee/roadacc

**Team:** R. Madhusri, S. Vaanavee, A. Nivetha

**My contribution (A. Nivetha):**
- Took part in defining the problem and designing the solution with the team
- Proposed ideas for the system's features
- Collected the data used for the project
- Prepared the presentation work

The website and backend were built by my teammates. This is a fork of their repository, kept for my portfolio.

An end-to-end full-stack emergency response system designed to streamline communication between citizens, ambulance drivers, and hospitals during critical "Golden Hour" medical emergencies.

---

## 🔗 Repository Access

To set up and run this project on any PC (Windows, macOS, or Linux):

```bash
git clone https://github.com/vaanavee/roadacc.git
cd roadacc
```

---

## 🛠️ Prerequisites

Make sure the following are installed on your machine:
- **Git**: [git-scm.com](https://git-scm.com/)
- **Node.js** (v18.0 or later) & **npm**: [nodejs.org](https://nodejs.org/)
- **Python** (v3.9 or later): [python.org](https://python.org/)

---

## 🚀 Quick Setup & Run Instructions

### 1. Frontend Setup (React + Vite + Tailwind CSS + Leaflet)

Open a terminal in the root `roadacc` directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:
- **Local:** `http://localhost:5173`
- **Network (Access from other PCs / phones on same Wi-Fi):**
  ```bash
  npm run dev -- --host
  ```

#### Available Portals:
- **Citizen / Public Portal:** `http://localhost:5173/` (Emergency SOS request, live ambulance tracking, hospital finder)
- **Ambulance Driver Portal:** `http://localhost:5173/driver` (Dispatch alerts, turn-by-turn navigation, patient status)

---

### 2. Backend Setup (FastAPI + WebSockets)

Open a second terminal in the root `roadacc` directory:

```bash
cd backend
```

#### On Windows (PowerShell / Command Prompt):
```bash
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### On macOS / Linux:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will run at:
- **API Root:** `http://localhost:8000`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`
- **WebSocket Endpoint:** `ws://localhost:8000/ws/dispatch`

---

### 3. ESP32 Hardware Integration (Optional)

The `esp32/` directory contains Arduino firmware (`firmware.ino`) for crash detection sensors.
- Flash to an ESP32 microcontroller using the Arduino IDE.
- Update `ssid`, `password`, and `serverUrl` in `esp32/firmware.ino` with your local backend IP.

---

## 🌐 Accessing from Another PC on the Local Network

1. Find the IP address of the host PC running the app:
   - **Windows:** Run `ipconfig` (look for `IPv4 Address`, e.g., `192.168.1.15`)
   - **macOS / Linux:** Run `ifconfig` or `ip a`
2. Start the frontend with host exposed:
   ```bash
   npm run dev -- --host
   ```
3. Start the backend with host exposed:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
4. On any other PC, tablet, or smartphone connected to the same Wi-Fi/network, open your browser and go to:
   - `http://<HOST_IP>:5173` (e.g. `http://192.168.1.15:5173`)

---

## 📂 Project Structure

```text
roadacc/
├── .gitignore               # Git ignore rules for node_modules, venv, build files
├── README.md                # Project documentation and setup guide
├── backend/                 # FastAPI backend server
│   ├── app/
│   │   └── main.py          # REST & WebSocket API endpoints
│   └── requirements.txt     # Python dependencies
├── frontend/                # Vite React TypeScript client
│   ├── src/
│   │   ├── App.tsx          # Main router & navigation
│   │   ├── DriverPortal.tsx # Ambulance driver dispatch interface
│   │   ├── UserPortal.tsx   # Citizen emergency SOS interface
│   │   ├── main.tsx         # React root
│   │   └── index.css        # Tailwind styling
│   ├── package.json         # Scripts and dependencies
│   ├── tsconfig.json        # TypeScript configuration
│   └── vite.config.ts       # Vite bundler config
└── esp32/                   # IoT firmware
    └── firmware.ino         # ESP32 crash sensor code
```
