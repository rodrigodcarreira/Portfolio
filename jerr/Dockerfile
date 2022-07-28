FROM node:current-alpine

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

#Install Frontend dependencies
RUN mkdir frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --production

#Install Backend dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

#Copy all files
COPY . .

#Build the frontend
WORKDIR /app/frontend
RUN npm run build

#Start the app
WORKDIR /app
CMD ["npm", "start"]
