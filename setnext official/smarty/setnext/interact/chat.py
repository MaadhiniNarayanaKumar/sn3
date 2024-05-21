import os
from os import environ

from setnext.utils.RedisHistoryManager import RedisHistoryManager
from setnext.utils.libs import Libs
from setnext.vector_stores.PineConeRetrievar import PineConeRetriever
import langchain_openai
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
from setnext.utils.Prompts import Prompts, PromptType

# region Initialize global variables from environment variables
utils = Libs()
utils.load_env()
# Pinecone Config - Start
OPENAI_EMBEDDING_MODEL = environ.get('OPENAI_EMBEDDING_MODEL')
PINECONE_INDEX_URL = environ.get('PINECONE_INDEX_URL')
PINECONE_API = environ.get('PINECONE_API')
PINECONE_INDEX_NAMESPACE = environ.get('PINECONE_INDEX_NAMESPACE')
PINECONE_K_VALUE = 5
# Pinecone Config - End
# Pinecone Config - End

# Redis - start
REDIS_HOST = environ.get("REDIS_HOST")
REDIS_HISTORY_KEY_PREFIX = environ.get("REDIS_HISTORY_KEY_PREFIX")
# Redis - end


# endregion

# endregion

# region QA Prompt Declaration
qa_system_prompt = """You are an Cessna Hospital Assistant Chat Bot. \
    Use the following pieces of retrieved context to answer the question. \
    If you don't know the answer, just say that you don't know. \
    Use three sentences maximum and keep the answer concise.\

    {context}"""
qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", qa_system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}"),
    ]
)


# endregion


class Chat:
    retriever = ""
    chatModel = ""
    llm = ""
    contextualize_q_chain = ""
    contextualize_q_system_prompt = ""
    CONTEXTUALIZATION = ""

    def __init__(
            self,
    ):
        try:
            self.pine_retriever = PineConeRetriever(PINECONE_INDEX_URL, PINECONE_API, OPENAI_EMBEDDING_MODEL,
                                                    PINECONE_INDEX_NAMESPACE,
                                                    PINECONE_K_VALUE, True, False, {})
            self.llm = langchain_openai.OpenAI(temperature=0.9, max_tokens=1000)
            self.chatModel = ChatOpenAI()
            self.CONTEXTUALIZATION = os.environ.get("CONTEXTUALIZATION")

            self.contextualize_q_chain = Prompts().get_prompts(PromptType.PROMPT_ENGLISH_ENHANCER) | self.llm | StrOutputParser()
        except ImportError:
            raise ImportError(
                "Could not import redis python package. "
                "Please install it with `pip install redis`."
            )

    def contextualized_question(self, input: dict):
        print("CONTEXTUALIZATION ", self.CONTEXTUALIZATION)

        if self.CONTEXTUALIZATION:
            return self.contextualize_q_chain
        else:
            print("No CONTEXTUALIZATION ")
            return input["question"]

    def interact(self, key, query) -> AIMessage:
        print("key", key)
        history = RedisHistoryManager(key=key)
        chat_history = history.get_history()
        retriever = self.pine_retriever
        rag_chain = (RunnablePassthrough.assign(context=self.contextualized_question | retriever | utils.doc_to_string)
                     | qa_prompt
                     | ChatOpenAI()
                     )
        model_reply = rag_chain.invoke({"question": query, "chat_history": chat_history})
        history.set_history_messages([(HumanMessage(content=query)), model_reply])
        print(type(model_reply))
        return model_reply
