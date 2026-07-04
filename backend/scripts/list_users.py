import sys
from pathlib import Path

# Ensure project root is on sys.path so local modules can be imported
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from database import SessionLocal
from models import users


if __name__ == '__main__':
    db = SessionLocal()
    try:
        rows = db.query(users.User).all()
        for u in rows:
            print(u.id, u.email, u.role)
        if not rows:
            print('NO_USERS')
    finally:
        db.close()
