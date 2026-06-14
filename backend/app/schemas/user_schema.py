from pydantic import BaseModel, EmailStr, ConfigDict, model_validator
from datetime import datetime
from typing import Optional
from app.enums.user_enum import UserRoleEnum

FREE_EMAIL_DOMAINS = {
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", 
    "live.com", "icloud.com", "me.com", "aol.com", 
    "protonmail.com", "zoho.com", "gmx.com", "yandex.com", 
    "mail.com", "fastmail.com", "rediffmail.com", "proton.me"
}

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: UserRoleEnum = UserRoleEnum.PERSONAL
    phone_number: Optional[str] = None

    @model_validator(mode="after")
    def validate_company_email_for_org_roles(self):
        if self.role in (UserRoleEnum.MANAGER, UserRoleEnum.WORKER):
            domain = self.email.split('@')[1].lower()
            if domain in FREE_EMAIL_DOMAINS:
                raise ValueError(
                    f"Manager and Worker roles require a company email address."
                    f"'{domain}' is not allowed."
                )
        return self


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: UserRoleEnum
    phone_number: Optional[str] = None
    company_domain: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

