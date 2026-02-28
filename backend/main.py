#para iniciar el backend:
#uvicorn main:app --reload

from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware 
from sqlalchemy import *
from sqlalchemy.orm import *
from dataBase import engine, get_db
from pydantic import BaseModel
from routers import ramos, evaluaciones, notas
import modelsDB, schemas

modelsDB.Base.metadata.create_all(bind = engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ramos.router)
app.include_router(evaluaciones.router)
app.include_router(notas.router)

@app.get("/")
def read_root():
    return {"mensaje": "El backend esta funcionando"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)