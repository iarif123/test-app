# Ensure you run $(aws ecr get-login --no-include-email) in terminal prior to running the dockerfile
FROM node:10-stretch

# Used to pass the git build sha1 to the container build process. 
# This value is outputted if available on container startup
ARG CONTAINER_BUILD_COMMIT
ENV CONTAINER_BUILD_COMMIT $CONTAINER_BUILD_COMMIT
ENV NODE_ENV production

ENV PATH /var/app/node_modules/.bin:$PATH

# Creating application directory
RUN mkdir -p /var/app

WORKDIR /var/app

# Install packages 
RUN npm ci

#Copy Application code to app folder
COPY . /var/app

# Compile Typescript
RUN npm run prod:build

#Expose port 3000 which the app runs on
EXPOSE 3000

#Start Command
CMD ["npm", "run", "prod:start"]
