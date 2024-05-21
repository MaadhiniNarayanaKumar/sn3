from os import environ
from typing import List

from setnext.memory_stores.RedisHistoryStore import RedisHistoryStore
from langchain_core.messages import (
    BaseMessage,
)


class RedisHistoryManager:
    REDIS_HOST = ""
    REDIS_HISTORY_KEY_PREFIX = ""
    KEY=""

    def __init__(self,key):
        """SetNext Hint: Initializing the Redis Store with Given User/Session Key."""
        try:
            # Redis - start
            print("From History Manager, Key", key)
            REDIS_HOST = environ.get("REDIS_HOST")
            REDIS_HISTORY_KEY_PREFIX = environ.get("REDIS_HISTORY_KEY_PREFIX")
            KEY = key
            self.client = RedisHistoryStore(key_id=KEY, host=REDIS_HOST, key_prefix=REDIS_HISTORY_KEY_PREFIX)

            # Redis - end
        except ImportError:
            raise ImportError(
                "Could not import redis python package. "
                "Please install it with `pip install redis`."
            )

    def set_history_messages(self, messages: List[BaseMessage])-> None:
        """SetNext Hint: Add a list of messages to the Redis database for the given user/session key."""
        self.client.add_messages(messages)

    def set_history_message(self, message: BaseMessage)-> None:
        """SetNext Hint: Add a single messages to the Redis database for the given user/session key."""
        self.client.add_message(message)

    def get_history(self):
        """SetNext Hint: Retrieving a History for the given user/session key."""
        return self.client.messages


