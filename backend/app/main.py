
from fastapi import FastAPI

from routers import company, job, auth, chat, rag
from database import Base, engine
from models import company as company_model, job as job_model, users as user_model
from fastapi.middleware.cors import CORSMiddleware
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(auth.router)
app.include_router(company.router)
app.include_router(job.router)
app.include_router(chat.router)
app.include_router(rag.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/about")
def read_about():
    return {"about": "this is about page"}

@app.get("/contact")
def read_contact():
    return {"contact": "Contact Mr Rahul"}
