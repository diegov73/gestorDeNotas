from typing import List, Optional
from sqlalchemy import *
from sqlalchemy.orm import *
from dataBase import Base

class Ramo(Base):
    __tablename__ = "ramos"

    id_ramo = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(30))
    nota_aprobado = Column(Float)
    nota_examen = Column(Float)
   
    evaluaciones = relationship("Evaluacion", back_populates="ramo")

class Evaluacion(Base):
    __tablename__ = "evaluaciones"

    id_evaluacion = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(30))
    peso = Column(Float)
    cantidad_notas = Column(Integer)

    id_ramo = Column(Integer, ForeignKey("ramos.id_ramo"))

    ramo = relationship("Ramo", back_populates="evaluaciones")
    notas = relationship("Nota", back_populates="evaluacion")

class Nota(Base):
    __tablename__ = "notas"
    
    id_nota = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(30))
    peso = Column(Float)
    valor = Column(Float)
    fecha = Column(Date)

    id_evaluacion = Column(Integer, ForeignKey("evaluaciones.id_evaluacion"))

    evaluacion = relationship("Evaluacion", back_populates="notas")