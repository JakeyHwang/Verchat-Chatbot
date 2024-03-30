import os
import sys
from langchain_community.document_loaders import PyPDFLoader
from dotenv import load_dotenv
from langchain.chains.question_answering import load_qa_chain
from langchain_openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA, ConversationalRetrievalChain

load_dotenv()

os.environ["OPENAI_API_KEY"] = os.getenv("openai_api_key")

# taking multiple pdfs at once
documents = []
for file in os.listdir('company_data'):
    if file.endswith('.pdf'):
        pdf_path = './company_data/' + file
        loader = PyPDFLoader(pdf_path)
        documents.extend(loader.load())

# we split the data into chunks of 1,000 characters, with an overlap
# of 200 characters between the chunks, which helps to give better results
# and contain the context of the information between chunks
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=10)
documents = text_splitter.split_documents(documents)

# we create our vectorDB, using the OpenAIEmbeddings tranformer to create
# embeddings from our text chunks. We set all the db information to be stored
# inside the ./data directory, so it doesn't clutter up our source files
vectordb = Chroma.from_documents(
    documents, 
    embedding=OpenAIEmbeddings(), 
    persist_directory="./data")
vectordb.persist()

qa_chain = ConversationalRetrievalChain.from_llm(
    ChatOpenAI(temperature=0.7, model_name='gpt-3.5-turbo'),
    vectordb.as_retriever(search_kwargs={'k': 6}),
    return_source_documents=True,
    verbose=False
)

yellow = "\033[0;33m"
green = "\033[0;32m"

chat_history = []

while True:
    query = input(f"{green}Prompt: ")
    if query == "exit" or query == "quit" or query == "q" or query == "f":
        print('Exiting')
        sys.exit()
    if query == '':
        continue
    result = qa_chain.invoke(
        {"question": query, "chat_history": chat_history})
    print(f"{yellow}Answer: " + result["answer"])
    chat_history.append((query, result["answer"]))