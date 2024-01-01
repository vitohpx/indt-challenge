FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm install -g typescript vite

RUN npm run build

CMD ["npm", "run", "dev"]