# Use an official Node.js runtime as a parent image
FROM node:18-alpine  

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies 
# Use --no-audit to speed up the build process
RUN npm ci --only=production --no-audit 

# Bundle app source 
# Copy everything else from your project directory into the container
COPY . .

# Build the React app for production
RUN npm run build

# Expose the port that your app will run on (usually 3000 for React)
EXPOSE 3000

# Start the app using a production-ready server like serve
CMD ["npx", "serve", "-s", "build"] 
