FROM node:18.18.0-bookworm

USER root

RUN mkdir -p /var/backend_server

WORKDIR /var/backend_server

COPY . /var/backend_server

RUN npm install

CMD ["npm", "run", "dev"]