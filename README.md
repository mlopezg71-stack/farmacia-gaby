# Farmacia Gaby

## Descripción

Plataforma web de comercio electrónico y gestión administrativa para Farmacia Gaby, desarrollada como proyecto del curso Seminario de Tecnologías de Información de la Universidad Mariano Gálvez de Guatemala.

El sistema permitirá integrar en una misma plataforma los servicios orientados al cliente y los procesos internos de la farmacia.

## Tecnologías

### Backend

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- Railway

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Vercel

## Estructura del proyecto

- `backend/` - API y lógica del servidor.
- `frontend/` - Aplicación web.
- `docs/` - Documentación del proyecto.

## Arquitectura del proyecto

El sistema utiliza una arquitectura basada en microservicios para separar las principales funcionalidades de la plataforma.

### Microservicios

- `services/auth/` - Microservicio de autenticación.
- `services/catalogo/` - Microservicio relacionado con el catálogo de productos.
- `services/inventario/` - Microservicio relacionado con el inventario.
- `services/pedidos/` - Microservicio para la gestión de pedidos.
- `services/pagos/` - Microservicio para la gestión de pagos.

### Infraestructura

- PostgreSQL - Sistema de gestión de base de datos.
- Redis - Servicio de almacenamiento en memoria.
- Docker - Contenedorización de los servicios.
- Docker Compose - Orquestación del entorno local.

## Instalación

### Clonar el repositorio

```bash
git clone https://github.com/mlopezg71-stack/farmacia-gaby.git
cd farmacia-gaby
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Ejecución con Docker

Para iniciar la infraestructura y los servicios:

```bash
docker compose up -d
```

Para verificar el estado de los contenedores:

```bash
docker compose ps
```

Para detener los servicios:

```bash
docker compose down
```

## Variables de entorno

El backend utiliza variables de entorno para la conexión a la base de datos y autenticación.

DATABASE_URL=tu_url_de_base_de_datos
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=8h

El frontend puede utilizar:

VITE_API_URL=http://localhost:3000/api

## Estado

Proyecto en desarrollo.

## Autores

**Grupo No. 6**

- Marcous Samir Andree Lopez Gonzalez        0900-18-13299
- Daniel Alejandro Morales Arias             0900-22-3068
- Diego Morales Arias                        0900-22-3088
- Christian Alexander Sierra Elias           0900-22-1815

## Universidad

Universidad Mariano Gálvez de Guatemala  
Seminario de Tecnologías de Información  
2026