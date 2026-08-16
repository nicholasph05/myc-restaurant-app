# MyC Restaurant App


Aplicación web full stack para la gestión de un restaurante, orientada al manejo de clientes, platos, pedidos, reseñas y preferencias alimenticias.


El proyecto fue desarrollado con React y TypeScript en el frontend, Node.js y Express.js en el backend, utilizando MySQL y MongoDB para la persistencia de información.


## Funcionalidades principales


- Gestión de clientes
- Gestión de platos y menú
- Gestión de pedidos
- Gestión de reseñas
- Registro de preferencias alimenticias
- Operaciones CRUD sobre las entidades principales
- Integración entre frontend y backend mediante API REST
- Persistencia de información en bases de datos relacionales y NoSQL
- Validación y procesamiento de información desde el backend


## Tecnologías utilizadas


### Frontend


- React
- TypeScript


### Backend


- Node.js
- Express.js


### Bases de datos


- MySQL
- Sequelize
- MongoDB
- Mongoose


### Herramientas


- Git
- GitHub
- npm
- Postman


## Arquitectura


La aplicación utiliza una arquitectura cliente-servidor en la que el frontend consume los servicios expuestos por el backend mediante una API REST.



React + TypeScript
        |
        | HTTP / REST
        v
Node.js + Express.js
        |
        |-------------------|
        |                   |
        v                   v
      MySQL              MongoDB
    Sequelize            Mongoose

El backend se encarga de procesar las solicitudes provenientes del frontend, aplicar la lógica de negocio y gestionar la persistencia de los datos.

La aplicación utiliza dos tipos de bases de datos para trabajar con diferentes estructuras de información.


## Base de datos relacional

MySQL es utilizado como sistema de gestión de bases de datos relacional.

La interacción con MySQL se realiza mediante Sequelize, permitiendo trabajar con modelos y operaciones sobre la base de datos desde Node.js.


## Base de datos NoSQL

MongoDB es utilizado para almacenar información que puede beneficiarse de una estructura documental.

La integración con MongoDB se realiza mediante Mongoose.


## API REST

El backend expone endpoints REST que permiten al frontend interactuar con los diferentes recursos de la aplicación.

Las operaciones principales incluyen:

- Crear registros
- Consultar información
- Actualizar información
- Eliminar registros

Estas operaciones permiten gestionar las diferentes entidades relacionadas con el funcionamiento del restaurante.

## Gestión de clientes

El sistema permite almacenar y administrar información relacionada con los clientes.

Entre las operaciones disponibles se encuentran:

- Registro de clientes
- Consulta de información
- Actualización de datos
- Eliminación de registros
- Gestión de platos

La aplicación permite administrar los platos disponibles dentro del restaurante.

Esto incluye operaciones para:

- Crear platos
- Consultar platos disponibles
- Actualizar información
- Eliminar platos
- Gestión de pedidos

El sistema permite registrar y gestionar pedidos realizados por los clientes.

Los pedidos relacionan la información necesaria para representar las solicitudes realizadas dentro del restaurante.


## Reseñas y preferencias

La aplicación permite gestionar información relacionada con las reseñas de los clientes y sus preferencias alimenticias.

Esto permite trabajar con información adicional que puede ser utilizada para mejorar la experiencia del usuario.


## Ejecución del proyecto
**Requisitos
**
Para ejecutar el proyecto es necesario tener instalados:

- Node.js
- npm
- MySQL
- MongoDB
- Git

## Clonar el repositorio
git clone https://github.com/nicholasph05/myc-restaurant-app.git


## Ingresar al directorio del proyecto:

cd myc-restaurant-app
Backend


## Ingresar al directorio correspondiente al backend.
cd backend

## Instalar las dependencias:

npm install

Configurar las variables de entorno necesarias para la conexión con MySQL y MongoDB.

Ejemplo:

PORT=3000


DB_HOST=localhost
DB_USER=TU_USUARIO
DB_PASSWORD=TU_CONTRASEÑA
DB_NAME=TU_BASE_DE_DATOS


MONGODB_URI=mongodb://localhost:27017/restaurant

## Ejecutar el backend:

npm run dev

o, dependiendo de la configuración del proyecto:

npm start

## Frontend

Ingresar al directorio correspondiente al frontend:

cd frontend

## Instalar las dependencias:

npm install

## Ejecutar la aplicación:

npm run dev
Pruebas de API


Los endpoints del backend pueden probarse mediante Postman.

Esto permite verificar:

- Solicitudes GET
- Solicitudes POST
- Solicitudes PUT o PATCH
- Solicitudes DELETE
- Códigos de respuesta HTTP
- Información enviada y recibida mediante JSON
  
## Conceptos aplicados

Este proyecto me permitió aplicar y fortalecer conocimientos relacionados con:

- Desarrollo full stack
- React
- TypeScript
- Node.js
- Express.js
- Diseño y consumo de APIs REST
- Bases de datos relacionales
- Bases de datos NoSQL
- MySQL
- MongoDB
- Sequelize
- Mongoose
- Operaciones CRUD
- Arquitectura cliente-servidor
- Modelado de datos
- Integración entre frontend y backend
- Control de versiones con Git

  
## Posibles mejoras futuras
- Implementación de autenticación y autorización
- Control de acceso basado en roles
- Contenerización con Docker
- Pruebas automatizadas
- Documentación de la API con Swagger/OpenAPI
- Implementación de CI/CD
- Despliegue en servicios cloud
- Manejo centralizado de errores
- Validación avanzada de datos
- Logging y monitoreo
- Mejoras en la interfaz y experiencia de usuario
  
## Autor

Nicholas Pareja

Estudiante de Ingeniería Informática | Software Developer

GitHub: https://github.com/nicholasph05

LinkedIn: https://www.linkedin.com/in/nicholas-pareja-4316a718a/
