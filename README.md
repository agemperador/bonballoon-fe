# Bonballoon — Frontend

Aplicación Angular 16 para la tienda de globos. Consume la API REST del backend.

## Requisitos

- Node.js 18+
- npm 9+

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm start
# Disponible en http://localhost:4200
```

El archivo `src/environments/environment.ts` apunta al backend en `http://localhost:8000`. Cámbialo si tu backend está en otra URL.

## Producción

### Build estático

```bash
npm run build -- --configuration production
# Archivos en dist/bonballoon/
```

### Docker (nginx)

```bash
# Construir imagen
docker build -t bonballoon-frontend .

# Correr contenedor
docker run -p 80:80 bonballoon-frontend
# Disponible en http://localhost
```

## Estructura

```
src/
├── app/
│   ├── app.module.ts
│   ├── app.component.*
│   ├── components/
│   │   ├── header/
│   │   ├── footer/
│   │   ├── hero/
│   │   ├── product-card/
│   │   └── product-list/
│   └── services/
│       ├── api.service.ts       # Llamadas HTTP al backend
│       └── cart-state.service.ts
├── environments/
│   └── environment.ts           # URL del backend
└── styles/
    ├── _palette.scss            # Variables de color
    └── styles.scss
```

## Configuración del backend

Edita `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000'  // <-- URL de tu backend
};
```

Para producción, crea `src/environments/environment.prod.ts` con la URL real.
