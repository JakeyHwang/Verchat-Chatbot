import langchain
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langchain_core.messages import AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder , PromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.prompts import PromptTemplate
import os

os.environ["OPENAI_API_KEY"] = os.environ.get("openai_api_key")


def get_history(question_id ):
    messages = [
    SystemMessage(content="You're a helpful assistant"),
    ]
    return messages

def save_history(question_id , question , answer):

    return question , answer

def ask_question(question_id,question):
    history = get_history(question_id)
    chat = ChatOpenAI()
    history.append(HumanMessage(content=question))
    answer = chat.invoke(history).content
    # save_history(question_id,question,answer)
    return answer