# Pull Docker Hub base image
FROM node:18-alpine3.15
# Set working directory
WORKDIR /catering/backend
# Install app dependencies
COPY package.json .
RUN npm install -g nodemon@2.0.19
RUN npm install
# Copy app to container
COPY . .
# Run the "start" script in package.json
CMD ["npm", "run", "docker"]