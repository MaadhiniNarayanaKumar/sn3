from langchain.schema import Document
from typing import List
import os
from dotenv import load_dotenv
from functools import lru_cache
from setnext.utils.config import Settings

class Libs:

    def __init__(self):
        try:
            print("Libs")
        except ImportError:
            raise ImportError(
                "Could not import redis python package. "
                "Please install it with `pip install redis`."
            )

    def doc_to_string(self, docs: List[Document]) -> str:
        """Append the message to the record in Redis"""
        return "\n\n".join(doc.page_content for doc in docs)

    def load_env(self):
        # if os.environ.get('env') == "dev":
        print('loading dev env')
        load_dotenv('.env.dev')
        # elif os.environ.get('env') == "stg":
        #     print('loading stg env')
        #     load_dotenv('.env.stg')
        # else:
        #     print('loading prod env')
        #     load_dotenv('.env.prd')

    @lru_cache
    def get_settings(self):
        return Settings()

