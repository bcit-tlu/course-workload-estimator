## Build stage
FROM node:24.6.0-alpine3.22 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

RUN npm run build


## Release/production
FROM nginxinc/nginx-unprivileged:alpine3.22-perl

LABEL maintainer=courseproduction@bcit.ca
LABEL org.opencontainers.image.source="https://github.com/bcit-tlu/course-workload-estimator"
LABEL org.opencontainers.image.description="A time calculator to estimate the number of hours of work learners might be expected to spend completing coursework."

COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist/ ./
