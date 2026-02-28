from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy import Text
from typing import List
import modelsDB, schemas
from dataBase import get_db

router = APIRouter(
    prefix="/api/evaluaciones",
    tags=["evaluaciones"]
)

@router.post("/{id_ramo}", response_model=schemas.EvaluacionResponse, status_code=status.HTTP_201_CREATED)
def create_evaluacion(id_ramo: str, evaluacion: schemas.EvaluacionCreate, db: Session = Depends(get_db)):
    
    ramo_existe = db.query(modelsDB.Ramo).filter(modelsDB.Ramo.id_ramo == id_ramo).first()
    if not ramo_existe:
        raise HTTPException(status_code=404, detail="El ramo asociado no existe")

    new_evaluacion = modelsDB.Evaluacion(
        nombre=evaluacion.nombre,
        peso=evaluacion.peso,
        cantidad_notas=evaluacion.cantidad_notas,
        id_ramo=id_ramo, 
    )

    db.add(new_evaluacion)
    db.commit()
    db.refresh(new_evaluacion) 
    
    return new_evaluacion  

@router.get("/", response_model=List[schemas.EvaluacionResponse])
def get_evaluaciones(db: Session = Depends(get_db)):
    
    evaluaciones = db.query(modelsDB.Evaluacion).all()
    
    return evaluaciones

@router.delete("/{id_evaluacion}", status_code=status.HTTP_200_OK)
def delete_evaluacion(id_evaluacion: str, db: Session = Depends(get_db)):

    evaluacion = db.query(modelsDB.Evaluacion).filter(modelsDB.Evaluacion.id_evaluacion == id_evaluacion).first()

    if not evaluacion:
        raise HTTPException(status_code=404, detail="evaluacion no existe")
    
    db.delete(evaluacion)
    db.commit()

    return None

