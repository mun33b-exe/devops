# 1. Use a lightweight Node.js image as the foundation
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy ONLY the package.json and package-lock.json first
COPY package*.json ./

# 4. Install dependencies inside the container
RUN npm install

# 5. Copy the rest of your application code
COPY . .

# 6. Document the port the app runs on
EXPOSE 3000

# 7. Define the command to start the application
CMD ["node", "index.js"]