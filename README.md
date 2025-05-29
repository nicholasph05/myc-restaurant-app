# 🍽️ MyC Restaurant App

**Sistema web completo para la gestión de un restaurante**, con manejo de clientes, platos, pedidos, reseñas, historial de consumo y preferencias alimenticias. Desarrollado con tecnologías modernas e integrando bases de datos relacional (MySQL) y no relacional (MongoDB).

---

## 🚀 Tecnologías utilizadas

### 📦 Backend
- Node.js + Express
- Sequelize (MySQL)
- Mongoose (MongoDB)
- Middlewares personalizados para validación

### 💻 Frontend
- React + TypeScript
- Bootstrap 5
- Fetch API + Formularios controlados

### 🗃️ Bases de Datos
- **MySQL** para: clientes, platos, reservas, pedidos
- **MongoDB** para: reseñas, preferencias, historial detallado

---

## 📂 Estructura del proyecto

myc-restaurant-app/
├── backend/ # API RESTful con Express
│ ├── models/ # Modelos Sequelize y Mongoose
│ ├── routes/ # Rutas para cada entidad (clientes, platos, pedidos...)
│ └── index.js # Configuración principal del servidor
├── frontend/ # Aplicación React
│ └── src/pages/ # Páginas como Clientes, Platos, Pedidos, etc.
├── .gitignore
└── README.md

yaml
Copiar
Editar

---

## ✨ Funcionalidades clave

- 🧑‍💼 Gestión de clientes
- 🍽️ Administración de platos por categoría
- 🧾 Registro y consulta de pedidos con cálculo automático de total
- ❤️ Registro de preferencias alimenticias por cliente (estilos, intolerancias, favoritos)
- ⭐ Sistema de reseñas con filtros por tipo de visita, calificación y nombre de plato
- 📊 Historial de pedidos con observaciones por plato

---

## ⚙️ Instrucciones para ejecutar el proyecto

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/nicholasph05/myc-restaurant-app.git
cd myc-restaurant-app

2️⃣ Instalar dependencias
Backend:

bash
Copiar
Editar
cd backend
npm install


Frontend:

bash
Copiar
Editar
cd ../frontend
npm install
3️⃣ Configurar entorno
Crea un archivo .env dentro de backend/ con lo siguiente:

env
Copiar
Editar
PORT=3000

# MySQL
DB_NAME=myc_restaurante
DB_USER=root
DB_PASS=tu_clave
DB_HOST=localhost

# MongoDB
MONGO_URI=mongodb://localhost:27017/myc_restaurante
4️⃣ Ejecutar el sistema
Backend:

bash
Copiar
Editar
cd backend
npm run dev
Frontend:

bash
Copiar
Editar
cd frontend
npm start