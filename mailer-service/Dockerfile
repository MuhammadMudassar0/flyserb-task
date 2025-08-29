FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production=false
COPY . .
RUN npm run build
CMD ["node", "dist/main.js"]