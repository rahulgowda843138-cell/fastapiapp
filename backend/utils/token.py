from datetime import datetime, timedelta

from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from sqlalchemy.orm import Session  # type: ignore[import]
from dotenv import load_dotenv
import os

from database import get_db
from models import users

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=2)):
    if not SECRET_KEY or not ALGORITHM:
        raise HTTPException(status_code=500, detail="JWT configuration is missing")

    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_access_token(token: str, db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not SECRET_KEY or not ALGORITHM:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    try:
        to_decode = jwt.decode(token, key=SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_id = to_decode.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    current_user = db.query(users.User).filter(users.User.id == int(user_id)).first()
    if current_user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return current_user

