from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy import Text
from typing import List
import modelsDB, schemas
from dataBase import get_db

router = APIRouter(
    prefix="/api/notas",
    tags=["notas"]
)

@router.post("/{id_evaluacion}", response_model=schemas.NotaResponse, status_code=status.HTTP_201_CREATED)
def create_nota(id_evaluacion: str, nota: schemas.NotaCreate, db: Session = Depends(get_db)):

    Eva_exist = db.query(modelsDB.Evaluacion).filter(modelsDB.Evaluacion.id_evaluacion == id_evaluacion).first()

    if not Eva_exist:
        raise HTTPException(status_code=404, detail="La evaluacion asociada no existe")
    
    new_nota = modelsDB.Nota(
        nombre = nota.nombre,
        valor = nota.valor,
        fecha = nota.fecha,
        peso = nota.peso,
        id_evaluacion = id_evaluacion
    )
    
    db.add(new_nota)
    db.commit()
    db.refresh(new_nota)
    
    return new_nota

@router.delete("/{id_nota}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ramo(id_nota: str, db: Session = Depends(get_db)):

    nota = db.query(modelsDB.Nota).filter(modelsDB.Nota.id_nota == id_nota).first()

    if not nota:
        raise HTTPException(status_code=404, detail="nota no existe")
    
    db.delete(nota)
    db.commit()

    return None
