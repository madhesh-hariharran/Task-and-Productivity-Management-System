from fastapi import FastAPI
from app.routes.auth_routes import router as auth_router
from app.routes.task_routes import router as task_router
from app.routes.assigned_task_routes import router as assigned_task_router
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(task_router)
app.include_router(assigned_task_router)