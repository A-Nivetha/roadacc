import os
import json

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Frontend setup
write_file('frontend/package.json', json.dumps({
  "name": "golden-hour-frontend",
  "private": True,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "lucide-react": "^0.364.0",
    "tailwindcss": "^3.4.1",
    "axios": "^1.6.8"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}, indent=2))

write_file('frontend/vite.config.ts', '''import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
''')

write_file('frontend/index.html', '''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Golden Hour</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
''')

write_file('frontend/src/main.tsx', '''import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
''')

write_file('frontend/src/index.css', '''@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-900 text-slate-50;
  }
}
''')

write_file('frontend/src/App.tsx', '''import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const UserPortal = () => <div className="p-8"><h1 className="text-3xl font-bold text-teal-400">User Portal</h1><p>Request SOS, view nearby hospitals and ambulances.</p></div>;
const DriverPortal = () => <div className="p-8"><h1 className="text-3xl font-bold text-teal-400">Driver Portal</h1><p>Ambulance Dispatch & Status.</p></div>;
const HospitalPortal = () => <div className="p-8"><h1 className="text-3xl font-bold text-teal-400">Hospital Portal</h1><p>Incoming emergencies and coordination.</p></div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <nav className="p-4 bg-slate-800 shadow-md flex gap-4">
          <Link to="/" className="text-teal-400 hover:text-teal-300 font-bold">Golden Hour</Link>
          <Link to="/user" className="text-white hover:text-teal-300">User</Link>
          <Link to="/driver" className="text-white hover:text-teal-300">Driver</Link>
          <Link to="/hospital" className="text-white hover:text-teal-300">Hospital</Link>
        </nav>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<div className="p-8 text-center"><h1 className="text-5xl font-bold mb-4 text-teal-400">Golden Hour</h1><p className="text-xl">Intelligent Emergency Response</p></div>} />
            <Route path="/user" element={<UserPortal />} />
            <Route path="/driver" element={<DriverPortal />} />
            <Route path="/hospital" element={<HospitalPortal />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
''')

write_file('frontend/tailwind.config.js', '''/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
''')

# Backend setup
write_file('backend/requirements.txt', '''fastapi==0.104.1
uvicorn==0.24.0.post1
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
geoalchemy2==0.14.2
pydantic==2.5.2
websockets==12.0
python-dotenv==1.0.0
''')

write_file('backend/app/main.py', '''from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI(title="Golden Hour API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Golden Hour API"}

@app.get("/api/ambulances/nearby")
def get_nearby_ambulances(lat: float, lon: float):
    # Mock data
    return [
        {"id": 1, "status": "AVAILABLE", "distance_km": 1.2, "eta_mins": 5},
        {"id": 2, "status": "AVAILABLE", "distance_km": 3.4, "eta_mins": 12},
    ]

@app.get("/api/hospitals/nearby")
def get_nearby_hospitals(lat: float, lon: float):
    # Mock data
    return [
        {"id": 1, "name": "City General Hospital", "distance_km": 2.1, "contact": "+91 9876543210"},
    ]

# Websocket for real-time dispatch
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/dispatch")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Dispatch update: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
''')

# ESP32 setup
write_file('esp32/firmware.ino', '''#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://backend-url/api/offline-crash";

const int CRASH_SENSOR_PIN = 4;
const int BUZZER_PIN = 5;

void setup() {
  Serial.begin(115200);
  pinMode(CRASH_SENSOR_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected!");
}

void loop() {
  int crashDetected = digitalRead(CRASH_SENSOR_PIN);
  if (crashDetected == LOW) {
    Serial.println("CRASH DETECTED! Attempting to send offline alert...");
    digitalWrite(BUZZER_PIN, HIGH);
    
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");
      
      String payload = "{\"lat\": 19.0760, \"lon\": 72.8777, \"severity\": \"HIGH\", \"status\": \"PENDING_OFFLINE_ALERT\"}";
      int httpResponseCode = http.POST(payload);
      
      if (httpResponseCode > 0) {
        Serial.print("Alert Sent. Response: ");
        Serial.println(httpResponseCode);
      } else {
        Serial.print("Error sending alert: ");
        Serial.println(httpResponseCode);
        // Implement offline retry logic (save to NVRAM)
      }
      http.end();
    }
    delay(5000); // Debounce
    digitalWrite(BUZZER_PIN, LOW);
  }
  delay(100);
}
''')

print("Scaffolding complete.")
