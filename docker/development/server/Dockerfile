FROM node:12
RUN npm --global config set user root && npm install -g sequelize-cli nodemon
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./server/package*.json ./
RUN npm install
COPY ./server/src .