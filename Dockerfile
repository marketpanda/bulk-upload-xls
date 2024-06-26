FROM node:18.2-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080 

CMD ["npm", "run", "dev"]
 
