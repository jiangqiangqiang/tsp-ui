FROM alpine

RUN apk add caddy

COPY ./dist/dist /app

EXPOSE 80
CMD ["caddy", "-root", "/app", "-port", "80"]
