from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.sockets.socket import sio_app

from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
from app.routers.post import router as post_router

from app.db.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/ws", sio_app)
app.mount("/static", StaticFiles(directory="./app/statics"), name="static")

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(post_router)

@app.get("/")
async def root():
    return {"message": "Hello World"}