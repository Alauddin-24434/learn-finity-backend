FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# install everything including devDependencies
RUN npm install

COPY . .

# build TypeScript
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
