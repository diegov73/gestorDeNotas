from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
import modelsDB, schemas
from dataBase import get_db

router = APIRouter(
    prefix="/ramos",
    tags=["ramos"]
)

@router.post("/", response_model=schemas.RamoResponse, status_code=status.HTTP_201_CREATED)
def create_ramo(ramo: schemas.RamoCreate, db: Session = Depends(get_db)):
    ramoDB = modelsDB.Ramo(
        nombre=ramo.nombre,
        nota_aprobado = ramo.nota_aprobado,
        nota_examen = ramo.nota_examen
    )
    db.add(ramoDB)
    db.commit()
    db.refresh(ramoDB)
    return ramoDB

@router.get("/", response_model=List[schemas.RamoResponse], status_code=status.HTTP_200_OK)
def read_all_ramos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):

    ramosDB = db.query(modelsDB.Ramo).offset(skip).limit(limit).all()
    return ramosDB

@router.patch("/{id_ramo}", response_model=schemas.RamoResponse, status_code=status.HTTP_202_ACCEPTED)
def update_ramo(id_ramo: int, ramo_update: schemas.RamoUpdate, db: Session = Depends(get_db)):
    
    ramoDB = db.query(modelsDB.Ramo).filter(modelsDB.Ramo.id_ramo == id_ramo).first()

    if ramoDB is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ramo no encontrado")
    
    update_data = ramo_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ramoDB, key, value)
    
    db.commit()
    db.refresh(ramoDB)
    return ramoDB

@router.delete("/{id_ramo}", status_code=status.HTTP_200_OK)
def delete_ramo(id_ramo: str, db: Session = Depends(get_db)):
    ramoDB = db.query(modelsDB.Ramo).filter(modelsDB.Ramo.id_ramo == id_ramo).first()

    if ramoDB is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ramo no encontrado")
    
    db.delete(ramoDB)
    db.commit()
    return None