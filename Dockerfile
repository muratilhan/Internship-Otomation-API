# Base image
FROM node:20.11.1

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

COPY ./prisma prisma
COPY ./src src
RUN npm run build

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "dev"]