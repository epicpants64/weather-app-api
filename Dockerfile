FROM node:alpine as base
WORKDIR /APP
EXPOSE 3000

FROM base AS dependencies
COPY package.json .
RUN npm install --omit=dev

FROM dependencies
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]