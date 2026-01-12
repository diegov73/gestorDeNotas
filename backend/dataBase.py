from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB = "postgresql://postgres:1234@localhost/gestorDeNotas"

engine = create_engine(DB)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()