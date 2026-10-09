# Golden Hour — Intelligent Emergency Response & Coordination Platform

An end-to-end full-stack web application designed for emergency-management. It features three role-based portals: Public/User, Ambulance Driver, and Hospital.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Vite, Leaflet, WebSockets
- **Backend**: FastAPI, Python 3.9+, WebSockets, SQLAlchemy
- **Database**: PostgreSQL with PostGIS
- **IoT/Hardware**: ESP32 for offline crash detection and driver alerts

## Setup Instructions

### 1. Database Setup
Ensure you have PostgreSQL installed with the PostGIS extension.
```sql
CREATE DATABASE golden_hour;
\c golden_hour;
CREATE EXTENSION postgis;
```

### 2. Backend Setup
Navigate to the `backend` directory.
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Frontend Setup
Navigate to the `frontend` directory.
```bash
cd frontend
npm install
npm run dev
```

### 4. Demo Data
The backend includes a startup script that populates mock hospitals, ambulances, and incidents in an Indian city (e.g., Delhi or Mumbai).

## Project Structure
- `/frontend` - React application
- `/backend` - FastAPI application
- `/esp32` - ESP32 firmware example (C++)
