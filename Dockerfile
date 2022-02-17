FROM node:alpine

WORKDIR /code
COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./tsconfig*.json ./
RUN yarn install

CMD ["npm", "run", "dev"]
