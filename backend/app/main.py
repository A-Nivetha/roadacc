from fastapi import FastAPI, WebSocket, WebSocketDisconnect
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
