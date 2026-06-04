from jose import jwt, JWTError
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

def create_access_token(user_id: int):
    payload = {
        "sub": str(user_id), #jwt standard expects string
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES) #utcnow because jwt uses utc time
    }
    
    access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return access_token

def decode_access_token(token: str):
    try:
        payload_dict = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload_dict.get("sub")
        if user_id is None:
            return None
        user_id = int(user_id)
    except JWTError:
        return None
    
    return user_id