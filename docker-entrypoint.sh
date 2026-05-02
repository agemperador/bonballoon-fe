#!/bin/sh
# Railway asigna $PORT dinámicamente; lo inyectamos en la config de nginx
export PORT=${PORT:-8080}
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf > /tmp/nginx-default.conf
cp /tmp/nginx-default.conf /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"
