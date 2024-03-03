FROM node:20.11.1-alpine AS builder

WORKDIR /build

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

FROM nginx:latest as prod

WORKDIR /app

COPY nginx/app.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /build/www /app

EXPOSE 80
