import socketio
from app.sockets.notifications import NotificationSocket

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=[])
sio_app = socketio.ASGIApp(sio, socketio_path='/ws/socket.io')

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    
@sio.event
async def disconnect(sid):
    print(f"Client disconnected from default namespace: {sid}")
    
sio.register_namespace(NotificationSocket("/notifications"))