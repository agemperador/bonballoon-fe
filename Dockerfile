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

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
