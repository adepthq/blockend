FROM node:alpine

WORKDIR /code
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install

CMD ["npm", "run", "dev"]
