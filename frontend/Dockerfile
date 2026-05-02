FROM node:20-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm run build

FROM nginx:stable-alpine
COPY /app/dist /usr/share/nginx/html

EXPOSE 80
CMD [ "ngnex", "-g", "daemon off;"]

