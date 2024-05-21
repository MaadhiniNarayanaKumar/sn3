from enum import Enum
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from setnext.enums.PromptTypes import PromptType
from typing import Optional


class Prompts:
    custom_system_prompt = ""
    custom_human_prompt = ""
    english_prompt = "Check the Grammar mistakes from the question and enhance it as a proper question, Do NOT Answer the question. If the questions is fine with grammar return as is"
    cessna_prompt = "Check the Grammar mistakes from the question and enhance it as a proper question, Do NOT Answer the question. If the questions is fine with grammar return as is"
    smartpak_prompt = "Check the Grammar mistakes from the question and enhance it as a proper question, Do NOT Answer the question. If the questions is fine with grammar return as is"

    def get_prompts(self, prompt: PromptType, system_prompt: Optional[str] = "", human_prompt: Optional[str] = ""):
        if prompt.PROMPT_ENGLISH_ENHANCER:
            return ChatPromptTemplate.from_messages(
                [
                    ("system", self.english_prompt),
                    ("human", "{question}"),
                ])
        elif prompt.PROMPT_CESSNA_ENHANCER:
            return ChatPromptTemplate.from_messages(
                [
                    ("system", self.cessna_prompt),
                    ("human", "{question}"),
                ])

        elif prompt.PROMPT_SMARTPAK_ENHANCER:
            return ChatPromptTemplate.from_messages(
                [
                    ("system", self.smartpak_prompt),
                    ("human", "{question}"),
                ])
        elif prompt.PROMPT_CUSTOM:
            return ChatPromptTemplate.from_messages(
                [
                    ("system", self.custom_system_prompt),
                    ("human", self.custom_human_prompt),
                ])
        else:
            return ChatPromptTemplate.from_messages(
                [
                    ("system", self.custom_system_prompt),
                    ("human", self.custom_human_prompt),
                ])
