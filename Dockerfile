FROM node:alpine

WORKDIR /code
COPY ./package.json ./
RUN yarn install

CMD ["npm", "run", "dev"]
