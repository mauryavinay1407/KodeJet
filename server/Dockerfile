FROM node:20-alpine

# Install JDK
RUN apk add --no-cache openjdk11-jdk

# Set environment variable for java
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk

WORKDIR /app

COPY package* ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
