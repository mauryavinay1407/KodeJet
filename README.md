## KodeJet
 KodeJet is a web based online compiler to execute c++ and python codes.

## Features

- Compile and run C++ and Python code.
- Real-time code execution results.

## Technologies Used
 
 * **Node.js**: Backend JavaScript runtime environment.
 * **Express.js**: Web application framework for Node.js.
 * **React.js**: Frontend Javascript Web application.
 * **MongoDB**: NoSQL database for storing URL mappings and statistics.
 * **Mongoose**: MongoDB object modeling for Node.js.
 * **Tailwindcss**: Tailwind CSS for responsive design.

## Installation
* Clone the repository:

```bash
git clone https://github.com/mauryavinay1407/KodeJet.git
cd KodeJet
```

* Install server dependencies:
```bash
cd server
npm install
```

* Install client dependencies:
```bash
cd ..
cd client
npm install
```
* Configure environment variables:

Create a .env file in the root directory and define the variables:

* Start the server:

```bash
cd server
npm start
```

* Start the client:

```bash
cd ..
cd client
npm run dev
```

# Docker Setup

## Dockerfile

   A Dockerfile is provided to build a Docker image for the application.

### To build the Docker image for frontend:

```bash
docker build -t kodeJet-client .
```
* To run the docker container:
```bash
docker run -d -p 5173:5173 kodeJet-client
```

### To build the Docker image for backend:

```bash
docker build -t kodeJet-server .
```
* To run the docker container:
```bash
docker run -p 3000:3000 -e DATABASE_URL="mongodb+srv://username:<password>@cluster0.svluirs.mongodb.net/kodejet" kodeJet-server
```