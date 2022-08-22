# Pull Docker Hub base image
FROM node:18-alpine3.15

# Set working directory
WORKDIR /catering/frontend

# Install app dependencies
COPY package.json .

RUN npm install --force

# Copy app to container
COPY . .
RUN npm run build
# Run the "start" script in package.json
CMD ["npm", "start"]

