FROM node:latest

RUN mkdir -p /src
WORKDIR /src

COPY package.json .
RUN npm install && npm cache clean
COPY . .

CMD [ "npm", "start" ]
