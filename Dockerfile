FROM nginx:1.15.12-alpine
COPY ./galaxyvictor/dist/galaxyvictor/ /usr/share/nginx/html