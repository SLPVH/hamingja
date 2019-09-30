FROM node:12

WORKDIR /work

RUN npm install -g ionic

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "dev"]