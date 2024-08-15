FROM node:20-alpine

# Install JDK
RUN apk add --no-cache openjdk11-jdk

# Install Python
RUN apk add --no-cache python3 py3-pip

# Install C/C++ compilers
RUN apk add --no-cache build-base

# Set environment variable for Java
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk

WORKDIR /app

COPY package* ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
