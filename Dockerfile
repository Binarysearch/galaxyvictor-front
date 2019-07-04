FROM nginx:1.15.12-alpine
COPY ./galaxyvictor/dist/galaxyvictor/ /usr/share/nginx/html
ENV API_HOST=localhost
CMD echo ${API_HOST} > /usr/share/nginx/html/api-host && nginx -g "daemon off;"