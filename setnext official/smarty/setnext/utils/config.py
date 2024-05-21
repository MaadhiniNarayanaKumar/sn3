from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "SetNext Interact API"
    admin_email: str = "contact@setnext.io"
    app_version:str ="v0.0.1"


settings = Settings()