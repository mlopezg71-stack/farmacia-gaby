# MediCore - Sistema de Expediente Clínico Electrónico

## Descripción

MediCore es un sistema web desarrollado para la gestión integral de expedientes clínicos electrónicos. Permite administrar pacientes, expedientes médicos, consultas, diagnósticos, tratamientos, recetas médicas, citas y notificaciones, facilitando el trabajo del personal médico y mejorando el acceso a la información clínica.

## Tecnologías Utilizadas

### Backend

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* JWT Authentication
* Railway

### Frontend

* React
* Vite
* React Router DOM
* Axios
* React Icons

## Roles del Sistema

### Administrador

* Gestión de usuarios
* Gestión de pacientes
* Gestión de expedientes
* Gestión de consultas
* Gestión de diagnósticos
* Gestión de tratamientos
* Gestión de recetas
* Gestión de citas
* Gestión de disponibilidad médica
* Gestión de bitácora

### Médico

* Registro y atención de pacientes
* Creación de consultas médicas
* Diagnósticos
* Tratamientos
* Recetas médicas
* Gestión de citas
* Disponibilidad médica
* Creación de usuarios para pacientes

### Paciente

* Consulta de expediente clínico
* Consulta de diagnósticos
* Consulta de tratamientos
* Consulta de recetas
* Consulta de citas médicas
* Recepción de notificaciones

## Instalación

### Clonar repositorio

```bash
git clone https://github.com/mlopezg71-stack/medicore-expediente-clinico
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

## Variables de Entorno

Crear archivo `.env` en el backend con las variables necesarias:

```env

DATABASE_URL=tu_url_de_base_de_datos
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=8h

```

## Funcionalidades Implementadas

* Autenticación JWT
* Gestión de usuarios
* Gestión de pacientes
* Expedientes clínicos
* Consultas médicas
* Diagnósticos
* Tratamientos
* Recetas médicas
* PDF profesional de recetas
* Citas médicas
* Disponibilidad médica
* Notificaciones internas
* Bitácora de acciones
* Dashboard administrativo
* Dashboard médico
* Dashboard paciente

## Autores

Marcous Marcous Samir Andree Lopez Gonzalez   0900-18-13299
Eberson Estuardo Can                          0900-08-60

Proyecto desarrollado para Ingeniería de Software Fase II.
Universidad Mariano Gálvez de Guatemala.
