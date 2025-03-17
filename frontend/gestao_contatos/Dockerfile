FROM node:21-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install -g @angular/cli@18.2.11

RUN npm install

COPY . .

RUN ng build

FROM nginx:1.27.2-alpine

VOLUME /var/cache/nginx

COPY --from=build /app/dist/gestao_contatos/browser usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]