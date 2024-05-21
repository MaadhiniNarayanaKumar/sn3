import os
from langchain.schema import Document
from langchain_openai import OpenAI
from langchain.schema.retriever import BaseRetriever
from typing import List, Any
from langchain.callbacks.manager import CallbackManagerForRetrieverRun
from pinecone import Pinecone
from openai import OpenAI
from langchain_core.output_parsers import StrOutputParser


class PineConeRetriever(BaseRetriever):
    pinecone_url = ""
    pinecone_api_key = ""
    pine_namespace = ""
    openai_embedding_model = ""
    no_of_records_to_be_returned = 0
    is_metadata_required = False
    is_values_required = False
    filters = {}
    pc_index = ""
    open_ai_client = ""

    def __init__(self, pine_url: str, pine_api_key: str, openai_embedding_model: str, pine_namespace: str,
                 no_of_records_to_be_returned: int, is_metadata_required: bool, is_value_required: bool, filters: dict):
        super().__init__()

        self.pinecone_url = pine_url
        self.pinecone_api_key = pine_api_key
        self.pine_namespace = pine_namespace
        self.openai_embedding_model = openai_embedding_model
        self.no_of_records_to_be_returned = no_of_records_to_be_returned
        self.is_metadata_required = is_metadata_required
        self.is_values_required = is_value_required
        self.filters = filters


        try:
            self.open_ai_client = OpenAI(
                api_key=os.environ['OPENAI_API_KEY']
            )
        except ImportError:
            raise ImportError(
                "Could not able to construct OpenAI Client."
            )
        try:
            pc = Pinecone(api_key=self.pinecone_api_key)
            self.pc_index = pc.Index(host=pine_url)
        except ImportError:
            raise ImportError(
                "Could not able to construct PineCone Client."
            )

    def _get_relevant_documents(self, query: str, *, run_manager: CallbackManagerForRetrieverRun) -> List[Document]:
        index = self.pc_index

        OpenAIClient = self.open_ai_client

        query_vector = OpenAIClient.embeddings.create(input=query, model=self.openai_embedding_model).data[0].embedding

        print("Modified Question", StrOutputParser().invoke(query))
        # Query Pine con for the user query
        query_response = index.query(
            namespace=self.pine_namespace,
            vector=query_vector,
            top_k=self.no_of_records_to_be_returned,
            include_metadata=self.is_metadata_required,
            include_values=self.is_values_required,
            # filter=self.filters
        )
        docs = query_response['matches']

        result_docs = list()

        # Prepare documents
        for doc in docs:
            meta_data = {"source": doc.metadata["source"]}
            docFetched = Document(page_content=doc.metadata["text"], metadata=meta_data)
            result_docs.append(docFetched)
        print(result_docs)
        print("No of Documents", len(result_docs))
        print("retrieve completed from PineCone Retriever")

        return result_docs
