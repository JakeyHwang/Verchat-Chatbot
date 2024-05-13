# Verchat-Chatbot: Investment portfolio manager
This project requires several API keys and accounts to be set up as a pre-requisite. In the following, we will guide you through the installation and give necessary steps to get the chatbot online.

## Required API keys:

### 1. OPEN AI 

- go to https://openai.com/
- locate "API Login"
- create new account to create a new OPENAI project API key
![OPEN AI API key page](/assets/openai_api.png "OpenAI API key page")
  
### 2. TAVILY

- go to https://app.tavily.com/
- create an account to obtain an API key
![Tavily API key page](/assets/tavily_API.png "Tavily API key page")
  
### 3. PINECONE

- go to https://app.pinecone.io/
- create an account to obtain an API key
![Pinecone API key page](/assets/pinecone_api.png "Pinecone API key page")
- create a new index name
![Pinecone index creation page](/assets/pinecone_index_page.png "Pinecone index creation page")

### 4. FIREBASE

- go to https://console.firebase.google.com/
- create a new project
- create a new Firestore Database
- create a new collection
- head to "Project settings > Service accounts > Firebase Admin SDK > Generate new private key" and download "firebase_keys.json"
![Firebase keys download page](/assets/firestore_json_downlload.png "Firebase keys download page")

## Pulling project from Github

1. Clone the repository to your desired location (i.e. C:/path/to/folder/Verchat-Chatbot)

## Replacing API Keys

1. Open up the project folder using a code editor
2. Locate the "env.text" file in "C:/path/to/folder/Verchat-Chatbot/chatbot_back-end"
3. Fill in the required API keys for OPEN AI, TAVILY, PINECONE.
![Editting env file](/assets/env_file_edit.png "Editting env file")

5. Rename file "env.text" to ".env"
![Editting env file](/assets/env_file_rename.png "Editting env file")

7. Place "firebase_keys.json" into this directory

## Replacing Code Variables

1. In query_PDF.py and query_internet.py, insert your Pinecone index name.
2. Namespace can be changed to desired name
![Replacing code](/assets/replace_index.png "Replacing code")

## Creating a Virtual Environment

1. Open Command Prompt
2. To create the virtual environment:
`python -m venv <NameOfVirtualEnvironment>`
3. To activate the virtual environment:
`path/to/venv/<NameOfVirtualEnvironment>\Scripts\activate.bat`
![creating venv](/assets/create_venv.png "creating venv")

## Backend server package installation

1. In your command prompt, activate the previously-made virtual environment. This window is the "backend server"
2. Navigate to the "C:/path/to/folder/Verchat-Chatbot/chatbot_back-end"
3. Install python requirements found in /depedencies:
`pip install -r dependencies/requirements.txt`
![preparing backend](/assets/prepare_backend.png "preparing backend")

## Frontend server package installation

1. Open a new window of command prompt and activate the same virtual environment. This window is the "frontend server"
2. Navigate to the "C:/path/to/folder/Verchat-Chatbot/chatbot_front-end"
3. Install node.js packages:
`npm install`
![preparing frontend](/assets/prepare_frontend.png "preparing frontend")

## Running the servers and chatbot

1. In the "backend server" run:
`uvicorn app.main:app --host 127.1.1.1 --port 4000 --reload`
![running backend](/assets/run_backend.png "running backend")

2. In the "frontend server" run:
`npm run dev`
![running frontend](/assets/run_frontend.png "running frontend")

3. Once both servers have fully and successfully initiated, open up any internet browser to "http://localhost:3000" to view the chatbot
