FROM node:12

WORKDIR /work

RUN npm install -g ionic

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

# CMD ["start.sh"]
CMD ionic serve --port=$PORT --external --disableHostCheck
# CMD ["ionic", "serve"]
