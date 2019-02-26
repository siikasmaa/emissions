FROM node:11.10.0 as front
ENV NPM_CONFIG_LOGLEVEL error
ENV NPM_ENV production
COPY . .
RUN yarn install \
    && yarn run build

FROM golang:1.11-alpine as builder
RUN apk add --no-cache --update gcc musl-dev git mercurial
ENV SRC_DIR=/go/src/github.com/siikasmaa/emissions-api/
WORKDIR /app
ADD . $SRC_DIR
RUN cd $SRC_DIR; go get -v ./...
RUN cd $SRC_DIR; CC=gcc CGO_ENABLED=1 GOOS=linux GARCH=amd64 go build -o server; cp server /app/

FROM alpine:latest
COPY --from=builder /app/server .
COPY --from=front /build ./build/
WORKDIR /app
