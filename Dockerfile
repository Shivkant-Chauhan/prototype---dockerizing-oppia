FROM python:3.8

WORKDIR /app/oppia

# installing the pre-requisites
RUN apt-get update
RUN apt-get -y install curl
RUN apt-get -y install git
# RUN apt-get -y install software-properties-common
# RUN apt update
# RUN add-apt-repository ppa:webupd8team/java
# RUN apt-get -y install openjdk-8-jre
RUN apt-get -y install python3-dev
RUN apt-get -y install python3-setuptools
RUN apt-get -y install python3-pip
RUN apt-get -y install unzip
RUN apt-get -y install python3-yaml
RUN apt-get -y install python-matplotlib
RUN apt-get -y install python3-matplotlib
RUN pip install --upgrade pip==21.2.3

# installing python dependencies from the requirements.txt file
COPY requirements.txt .
COPY requirements_dev.txt .

RUN pip install -r requirements.txt
RUN pip install -r requirements_dev.txt

## installing packages from the package.json file
COPY package.json .
RUN npm install --legacy-peer-deps

RUN apt-get -y install python2
COPY . .

EXPOSE 8080

# CMD [ "node_modules/.bin/ng", "serve", "--host", "0.0.0.0" ]
#
## NOTE :
## I am currently skipping the frontend build and the webpack compilation steps --
## (using the pre-built files in this prototype)
## command for building the frontend application: ./node_modules/.bin/ng build --host 0.0.0.0
## command for compiling the webpack bundles: ./node_modules/webpack/bin/webpack.js --config webpack.dev.config.ts

## NOTE:
## I am using Google App Engine to serve our app in to the browser (by serving the built webpack bundles) using
## the `app_dev.yaml` file. For the prototype to work, I am using the already installed `Google Cloud SDK- 364.0.0`
## from the /oppia-tools directory (copied to our root directory). This is a temporary solution,
## and I will be using the official docker image for the google cloud SDK while working in the GSoC project
## [link for the verified Google Cloud SDK image](https://hub.docker.com/r/google/cloud-sdk).
CMD [ "./oppia_tools/google-cloud-sdk-364.0.0/google-cloud-sdk/bin/dev_appserver.py", "app_dev.yaml", "--runtime", "python38", "--host", "0.0.0.0"]
