FROM node AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --network-timeout 100000

COPY . .

RUN NODE_ENV=production NODE_OPTIONS=--max_old_space_size=4096 PUBLIC_URL=/admin/ yarn build

#

FROM nginx AS server

COPY /nginx/ /etc/nginx/

WORKDIR /var/www/domain

COPY --from=builder /usr/src/app/build/ .
