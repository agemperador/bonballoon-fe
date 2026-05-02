# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# Runtime stage: nginx sirve los archivos estáticos
FROM nginx:alpine

# Copiar build de Angular
COPY --from=builder /app/dist/bonballoon /usr/share/nginx/html

# Configuración nginx: redirigir todas las rutas al index.html (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Script de inicio que sustituye $PORT en la config de nginx
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080

CMD ["/docker-entrypoint.sh"]
