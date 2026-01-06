from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
from app.services.city_manager import city_manager
from app.schemas import LogEvent
from app.consumer import consume_logs # Added import

app = FastAPI(title="Log Metropolis Backend")

# Active WebSocket Connections
active_connections = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            # Keep connection open. 
            # Actual broadcasting happens in the background task.
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)

async def broadcast_state():
    """The Game Loop: 10Hz Tick"""
    while True:
        await asyncio.sleep(0.1) # 100ms
        state = await city_manager.tick()
        
        # Broadcast to all connected clients
        json_data = state.model_dump_json()
        disconnected = []
        for connection in active_connections:
            try:
                await connection.send_text(json_data)
            except:
                disconnected.append(connection)
        
        for d in disconnected:
            if d in active_connections:
                active_connections.remove(d)

@app.on_event("startup")
async def startup_event():
    print("Backend Service Started")
    asyncio.create_task(broadcast_state())
    # Start Kafka Consumer
    asyncio.create_task(consume_logs())

@app.get("/")
def read_root():
    return {"message": "Log Metropolis Backend is running"}
