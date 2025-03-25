FROM node:18 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 13889

# Start the app with npm start
CMD ["npm", "run", "dev"]