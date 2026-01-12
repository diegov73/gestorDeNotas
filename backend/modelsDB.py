from typing import Optional
from sqlalchemy import *
from sqlalchemy.orm import *
from dataBase import Base

class Ramo(Base):
    __tablename__ = "ramos"
    id_ramo: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(30))
    evaluaciones: Mapped[list["Evaluacion"]] = relationship(back_populates="ramo")

class Evaluacion(base):
    __tablename__ = "evaluaciones"
    id_evalucion: Mapped[int] = mapped_column(primary_key=True, Index=True)
    nombre: Mapped[str] = mapped_column(String(30))
    peso: Mapped[float] = mapped_column(float)
    
    id_ramo: Mapped[int] = mapped_column(ForeignKey("Ramo.id_ramo"))

    ramo: Mapped["Ramo"] = relationship(back_populates="evaluacion")
    notas: Mapped[list["Nota"]] = relationship(back_populates="evaluacion")

class Nota(base):
    __tablename__ = "notas"
    id_nota: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(30))
    peso: Mapped[Optional[float]] = mapped_column(float)
    nota: Mapped[DECIMAL] = mapped_column(DECIMAL)
    fecha: Mapped[Optional[Date]] = mapped_column(Date)

    id_evaluacion: Mapped[int] = mapped_column(ForeignKey(Evaluacion.id_evalucion))

    evaluacion: Mapped["Evaluacion"] = relationship(back_populates="notas")
