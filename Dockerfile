FROM node:alpine

WORKDIR /code
COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./tsconfig*.json ./
RUN yarn install
COPY . ./

CMD ["npm", "run", "dev"]
