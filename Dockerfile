FROM node:alpine

WORKDIR /code
COPY ./package.json ./
RUN npm install

CMD ["npm", "run", "dev"]
