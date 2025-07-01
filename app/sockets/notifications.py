import socketio

class NotificationSocket(socketio.AsyncNamespace):
    async def on_connect(self, sid, environ):
        print(f"Client connected to notification namespace: {sid}")
        await self.emit("message", {"message": "You are connected to the notification service"})
        
    async def on_disconnect(self, sid):
        print(f"Client disconnected from notification namespace: {sid}")