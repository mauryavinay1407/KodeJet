FROM node:20-alpine as build_image

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

#For multi-stage build,great lightweight web server to serve the frontend assets
FROM node:20-alpine as production_image

WORKDIR /app

COPY --from=build_image /app/dist /app/dist

EXPOSE 5173

CMD ["npx", "serve", "-s", "dist", "-l", "5173"]
