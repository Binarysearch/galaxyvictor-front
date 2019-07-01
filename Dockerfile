FROM nginx:1.15.12-alpine
COPY ./galaxyvictor/dist/test-cicd/ /usr/share/nginx/html