from pydantic import BaseModel
from typing import List, Optional
from datetime import date

#NOTAS  
class NotaBase(BaseModel):
    nombre: str
    valor: float
    fecha: Optional[date] = None
    peso: Optional[float] = None
    color: Optional[str] = "#24731d"

class NotaCreate(NotaBase):
    pass

class NotaResponse(NotaBase):
    id_nota: str
    id_evaluacion: str

    class Config:
        from_attributes = True

#EVALUACIONES
class EvaluacionBase(BaseModel):
    nombre: str
    peso: float
    cantidad_notas: int
    color: Optional[str] = "#24731d"

class EvaluacionCreate(EvaluacionBase):
    pass

class EvaluacionResponse(EvaluacionBase):
    id_evaluacion: str
    id_ramo: str
    notas: List[NotaResponse] = []
    
    class Config:
        from_attributes = True

#RAMOS
class RamoBase(BaseModel):
    nombre: str
    nota_aprobado: float = 4.0
    nota_examen: float = 5.0
    color: Optional[str] = "#24731d"
    
class RamoCreate(RamoBase):
    pass

class RamoUpdate(BaseModel):
    nombre: Optional[str] = None

class RamoResponse(RamoBase):
    id_ramo: str
    evaluaciones: List[EvaluacionResponse] = []
    
    class Config:
        from_attributes = True