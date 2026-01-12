#para iniciar el backend:
#uvicorn backend.main:app --reload

from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware 
from sqlalchemy import *
from sqlalchemy.orm import *
from dataBase import engine, get_db
from pydantic import BaseModel
from . import modelsDB, schemas

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

@app.get("/")
def read_root():
    return {"mensaje": "El backend esta funcionando"}

@app.post("/ramos/", response_model=schemas.RamoResponse, status_code=status.HTTP_201_CREATED)
def create_ramo(ramo: schemas.RamoCreate, db: Session = Depends(get_db)):
    
    ramoDB = modelsDB.Ramo(nombre=ramo.nombre)
    db.add(ramoDB)
    db.commit()
    db.refresh(ramoDB)
    return ramoDB

@app.get("/ramos/", response_model=List[schemas.RamoResponse], status_code=status.HTTP_200_OK)
def read_all_ramos(skip: int=0, limit: int=100, db: Session = Depends(get_db)):
    
    ramosDB = db.query(modelsDB.Ramo).offset(skip).limit(limit).all()
    return ramosDB

@app.patch("/ramos/{id_ramo}", response_model=schemas.RamoResponse, status_code=status.HTTP_202_ACCEPTED)
def update_ramo(id_ramo: int, ramo_update: schemas.RamoUpdate, db: Session = Depends(get_db)):
    
    ramoDB = db.query(modelsDB.Ramo).filter(modelsDB.Ramo == id_ramo).first()

    if ramoDB is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ramo no encontrado")
    
    update_data = ramo_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(ramoDB, key, value)
    
    db.add(ramoDB)
    db.commit()
    db.refresh(ramoDB)
    return ramoDB

@app.delete("/ramo/{id_ramo}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ramo(id_ramo: int, db: Session Depends(get_db)):
    ramoDB = db.query(modelsDB.Ramo).filter(modelsDB.Ramo.id_ramo == id_ramo).first()

    if ramoDB is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ramo no encontrado")
    
    db.delete(ramoDB)
    db.commit()
    return None