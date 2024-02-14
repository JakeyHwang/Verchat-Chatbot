# Use an official Python runtime as the parent image
FROM python:3.10-slim
WORKDIR /usr/src/
COPY ./app ./app
COPY ./dependencies ./dependencies
RUN pip3 install --upgrade pip
RUN pip install --no-cache-dir -r ./dependencies/requirements.txt
EXPOSE 80

