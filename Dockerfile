FROM nginx:1.15.12-alpine
COPY ./galaxyvictor/dist/galaxyvictor/ /usr/share/nginx/html
ARG app_version_arg
ENV APP_VERSION=$app_version_arg
ENV API_HOST='"http://localhost"'
CMD echo '{ "appVersion": "'${APP_VERSION}'", "apiHost": "'${API_HOST}'" }' > /usr/share/nginx/html/app-info && nginx -g "daemon off;"