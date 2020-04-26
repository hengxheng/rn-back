FROM node:12
RUN npm --global config set user root && npm install -g sequelize-cli nodemon
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./api/package*.json ./
RUN npm install
COPY ./api/src .