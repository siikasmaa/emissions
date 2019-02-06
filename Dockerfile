FROM node:10.12.0 as front
# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL error
ENV NPM_ENV production

# Copy local files into the image.
COPY . .

# Build for production.
RUN yarn install \
    && yarn run build

FROM golang:1.10-alpine as builder
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
