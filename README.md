# Banco Solar - Gestión Financiera Personalizada

Banco Solar es una aplicación web moderna diseñada para proporcionar una experiencia bancaria segura y fácil de usar. Nuestro objetivo es ofrecer una plataforma intuitiva que permita a los usuarios realizar operaciones financieras como transferencias, gestión de cuentas y consultas de balances, todo esto desde la comodidad de su hogar u oficina.

## Deploy

La aplicación está desplegada y disponible para uso en: [Like Me en Mi Banco Solar](https://banco-2wbt.onrender.com/)

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![TAILWIND](https://img.shields.io/badge/tailwind-1c1a3b?style=for-the-badge&logo=tailwindcss&logoColor=%238e9bdf&labelColor=%231c1a3b)
![DaisyUI](https://img.shields.io/badge/Daisy-f?style=for-the-badge&logo=daisyUI&color=%231a0e3d&link=https%3A%2F%2Fdaisyui.com%2Fimages%2Fdaisyui-logo%2Fdaisyui-logomark.svg)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Sequelize](https://img.shields.io/badge/sequelize-24242d?style=for-the-badge&logo=sequelize&logoColor=2596be&labelColor=24242d)
![DOTENV](https://img.shields.io/badge/dotenv-0000?style=for-the-badge&logo=dotenv&logoColor=fff&color=b0a321)
![POSTGRES](https://img.shields.io/badge/Postgres-436590?style=for-the-badge&logo=postgresql&logoColor=fff&color=436590)
![Neon](https://img.shields.io/badge/neon-0c0c0c?style=for-the-badge&logo=neon&logoColor=fff&color=0c0c0c)

## Instalación

Para ejecutar localmente, necesitas tener instalado Node.js y PostgreSQL. Sigue estos pasos para la instalación:

1. Clona el repositorio:

   ```
   git clone https://github.com/gperzal/Prueba-Banco.git
   ```

2. Navega al directorio del proyecto:

   ```
   cd <tu-repo>
   ```

3. Instala las dependencias:

   ```
   npm i
   ```

4. Configura las variables de entorno según tu configuración de PostgreSQL en un archivo .env

   ```
   DB_USER = tu_usuario_de_base_de_datos
   DB_PASS = contraseña_de_base_de_datos
   DB_HOST = host_de_base_de_datos
   DB_NAME = nombre_de_la_base_de_datos
   ```

5. Ejecuta las migraciones para crear las tablas en la base de datos (Opt):

   ```
   npx sequelize-cli db:migrate
   ```

6. Inicia el servidor:
   ```
   npm start
   ```

## Características y Rutas

### Usuarios

| Ruta             | Método | Descripción                                    |
| ---------------- | ------ | ---------------------------------------------- |
| `/api/users`     | GET    | Obtiene una lista de todos los usuarios.       |
| `/api/users`     | POST   | Crea un nuevo usuario.                         |
| `/api/users/:id` | GET    | Obtiene los detalles de un usuario específico. |
| `/api/users/:id` | PUT    | Actualiza los datos de un usuario específico.  |
| `/api/users/:id` | DELETE | Elimina un usuario específico.                 |

### Transferencias

| Ruta                          | Método | Descripción                                                 |
| ----------------------------- | ------ | ----------------------------------------------------------- |
| `/api/transfers`              | GET    | Obtiene una lista de todas las transferencias.              |
| `/api/transfers`              | POST   | Realiza una nueva transferencia entre usuarios.             |
| `/api/transfers/:id/sent`     | GET    | Obtiene transferencias enviadas por un usuario específico.  |
| `/api/transfers/:id/received` | GET    | Obtiene transferencias recibidas por un usuario específico. |


