from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB = "postgresql+psycopg2://postgres:1234@localhost/GestorDeNotas"

Base = declarative_base()

engine = create_engine(DB)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()