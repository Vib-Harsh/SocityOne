from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError
from app.core.config import settings
from app.utils.logger import logger
import psycopg2
import sys

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    try:
        Base.metadata.create_all(bind=engine)
    except OperationalError as e:
        if "does not exist" in str(e.orig):
            logger.error(f"Database '{settings.DATABASE_NAME}' does not exist.")

            # Ask user if they want to create it
            ans = input(f"Do you want to create the database '{settings.DATABASE_NAME}'? (y/n): ")
            
            if ans.strip().lower() == 'y':
                try:
                    # Connect to default 'postgres' database to create the new one
                    conn = psycopg2.connect(
                        dbname="postgres",
                        user=settings.DATABASE_USER,
                        password=settings.DATABASE_PASSWORD,
                        host=settings.DATABASE_HOST,
                        port=settings.DATABASE_PORT
                    )
                    conn.autocommit = True
                    cursor = conn.cursor()
                    cursor.execute(f'CREATE DATABASE "{settings.DATABASE_NAME}";')
                    cursor.close()
                    conn.close()
                    logger.info(f"Database '{settings.DATABASE_NAME}' created successfully.")
                    # Retry creating tables now that DB exists
                    Base.metadata.create_all(bind=engine)
                except Exception as create_err:
                    logger.error(f"Failed to create database: {create_err}")
                    sys.exit(1)
            else:
                logger.info("Exiting...")
                sys.exit(1)
        else:
            logger.error("Database connection failed. Please ensure your PostgreSQL server is running and credentials are correct.")
            logger.error(f"Original error: {e.orig}")
            sys.exit(1)
    except Exception as e:
        logger.error(f"An unexpected error occurred while connecting to the database: {e}")
        sys.exit(1)
