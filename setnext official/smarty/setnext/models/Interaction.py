from pydantic import BaseModel,constr


class Interaction(BaseModel):
    query: str
