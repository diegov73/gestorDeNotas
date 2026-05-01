import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

db_name = os.getenv("DB_NAME")
db_host = os.getenv("DB_HOST")
db_password = os.getenv("DB_PASSWORD")
db_user = os.getenv("DB_USER")


DB = f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}/{db_name}"

Base = declarative_base()

engine = create_engine(DB)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()