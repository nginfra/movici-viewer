FROM node:15 AS builder
RUN mkdir /webconsole
WORKDIR webconsole

COPY client/package.json .
COPY client/package-lock.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY ./etc/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /webconsole/dist /usr/share/nginx/html/
