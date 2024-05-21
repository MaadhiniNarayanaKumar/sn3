from fastapi import FastAPI
from setnext.interact.chat import Chat
from setnext.utils.config import Settings
from setnext.utils.libs import Libs
from setnext.models.Interaction import Interaction
from functools import lru_cache
import uvicorn

# region Initialize global variables from environment variables
utils = Libs()
utils.load_env()
# endregion

# region App Declaration
app = FastAPI()
# endregion

chat = Chat()
settings = Libs().get_settings()


@app.get("/")
async def root():
    return {"Message": "Welcome to SetNext Interact API"}


@lru_cache
def get_settings():
    return Settings()


@app.get("/info")
def root():
    return {
        "app_name": settings.app_name,
        "admin_email": settings.admin_email,
        "api_version": settings.app_version,
    }


@app.post("/interact/")
def interact(interaction: Interaction, session_id: str):
    """Method to Interact with SetNext Model"""
    model_reply = chat.interact(key=session_id, query=interaction.query)
    return {"query": interaction.query, "answer": model_reply.content}


if __name__ == "__main__":
   uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)