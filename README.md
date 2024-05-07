# Verchat-Chatbot: Investment portfolio manager
This project requires several API keys and accounts to be set up as a pre-requisite. In the following, we will guide you through most of the installation steps and give necessary steos to get the chatbot online.

## Required API keys:
###1. OPEN AI 
- go to https://openai.com/
- locate "API Login"
- create new account to create a new OPENAI project API key
###2. TAVILY
- go to https://app.tavily.com/
- create an account to obtain an API key
###3. PINECONE
- go to https://app.pinecone.io/
- create an account to obtain an API key
- create a new index name
###4. FIREBASE
- go to https://console.firebase.google.com/
- create a new project
- create a new Firestore Database
- create a new collection

## Pulling project from Github
1. Clone the repository

## Replacing API Keys
1. Open up the project folder on an editor
2. Locate the "env.text" file in chatbot_back-end
3. Fill in the API keys for OPEN AI, TAVILY, PINECONE AND FIREBASE
4. Rename the "env.text" file to ".env"

## Creating a Virtual Environment
1. Open Command Prompt
2. Navigate to a directory of your choice (for example Desktop)
3. Create the virtual environment called "verchat_venv" by keying in:
   python -m venv verchat_venv

## Starting up the Backend 
1. In Command Prompt, ensure that you are in the same directory as the virtual environment file you have just created.
2. Start up the virtual environment by keying in:
   verchat_venv\Scripts\activate.bat
3. Navigate to the dependencies folder located in the project folder. For example:
   cd "C:\Users\User\OneDrive\Documents\GitHub\IS484-FYP-VC-chatbot\chatbot_back-end\dependencies"
4. Install requirements:
   pip install -r requirements.txt
5. Navigate to the previous folder:
  cd ../
6. Run the backend program:
   uvicorn app.main:app --host 127.1.1.1 --port 4000 --reload

## Starting up the Frontend
1. Open another Command Prompt window and navigate to the same directory as the virtual environment file.
2.Start up the virtual environment by keying in:
   verchat_venv\Scripts\activate.bat
3. Navigate to the "chatbot_front-end" folder located in the project folder. For example:
   cd "C:\Users\User\OneDrive\Documents\GitHub\IS484-FYP-VC-chatbot\chatbot_front-end"
4. Install node modules:
  npm install   
6. Install python:
   npm install python -r
7. Run the fronend program:
   npm run dev
8. Once it initialises you will see a link that states "http://localhost:3000"
9. Press "Ctrl" + click that link to open the web app up on your web browser

## Shutting down the frontend and backend
1. In their respective windows press "Ctrl + C" to exit the processes
2. Deactivate the respective virtual environments by keying in:
   deactivate
3. You may close the Command Prompt windows
