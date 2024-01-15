FROM node:latest

EXPOSE 8080

# set working directory
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY ./package*.json .
COPY ./src ./src
COPY ./public ./public
COPY ./.env .
COPY ./dbfiles ./dbfiles
COPY server.js .
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent





CMD ["/bin/bash"]