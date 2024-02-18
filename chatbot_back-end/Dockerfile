# Use an official Python runtime as the parent image
FROM python:3.10-slim
WORKDIR /chatbot_back-end
COPY ./app .
COPY ./dependencies .
COPY ./firebase_keys.json .
RUN pip3 install --upgrade pip
RUN pip install --no-cache-dir -r ./dependencies/requirements.txt
EXPOSE 4000

