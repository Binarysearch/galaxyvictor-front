FROM nginx:1.15.12-alpine
COPY ./dist/galaxyvictor/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
ARG app_version_arg
ENV APP_VERSION=$app_version_arg
ENV API_HOST='https://api.galaxyvictor.com'
CMD echo '{ "appVersion": "'${APP_VERSION}'", "apiHost": "'${API_HOST}'" }' > /usr/share/nginx/html/app-info && nginx -g "daemon off;"