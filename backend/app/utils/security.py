from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    bcrypt__rounds=12, #higher rounds = slower hashing = more secure
    deprecated = "auto"
)

def hash_password(password: str) -> str:
    hashed_password = pwd_context.hash(password)
    return hashed_password

def verify_password(password:str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password) #order important, shouldnt reverse
