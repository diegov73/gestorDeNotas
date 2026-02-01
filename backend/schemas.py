from pydantic import BaseModel
from typing import List, Optional
from datetime import date

#NOTAS  
class NotaBase(BaseModel):
    nombre: str
    valor: float
    fecha: Optional[date] = None

class NotaCreate(NotaBase):
    id_evaluacion: int

class NotaResponse(NotaBase):
    id_nota: int
    id_evaluacion: int

    class Config:
        from_attributes = True

#EVALUACIONES
class EvaluacionBase(BaseModel):
    nombre: str
    peso: float

class EvaluacionCreate(EvaluacionBase):
    id_ramo: int

class EvaluacionResponse(EvaluacionBase):
    id_evaluacion: int
    id_ramo: int
    notas: List[NotaResponse] = []
    class Config:
        from_attributes = True

#RAMOS
class RamoBase(BaseModel):
    nombre: str
    nota_aprobado: float = 4.0
    nota_examen: float = 5.0
    
class RamoCreate(RamoBase):
    pass

class RamoUpdate(BaseModel):
    nombre: Optional[str] = None

class RamoResponse(RamoBase):
    id_ramo: int
    evaluaciones: List[EvaluacionResponse] = []
    class Config:
        from_attributes = True