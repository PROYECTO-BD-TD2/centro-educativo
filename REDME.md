# Sistema de Gestión Educativa
Es un  sistema web de gestión educativa para administrar estudiantes, profesores, cursos, calificaciones e inscripciones.

## Características

- **Gestión de Alumnos**: Seguimiento de la información del estudiante y su historial académico  
- **Gestión de Profesores**: Administración de perfiles de profesores y asignación de cursos  
- **Gestión de Cursos**: Definición de cursos y asociación con profesores  
- **Gestión de Calificaciones**: Registro del rendimiento estudiantil en una escala del 1 al 12  
- **Gestión de Inscripciones**: Control del registro de estudiantes en los cursos

## Tecnologías

### Frontend
- Bootstrap 5 para una interfaz responsiva  
- Font Awesome 6.4.0 para íconos  
- JavaScript puro (ES6+)  
- Fetch API para solicitudes HTTP

### Backend
- PHP con arquitectura MVC  
- Base de datos MySQL  
- PDO para acceso seguro a la base de datos  
- Apache con mod_rewrite

## Instalación

1.  Puedes clonar el repositorio : 
    https://github.com/PROYECTO-BD-TD2/centro-educativo.git

    Si tienes el proyecto en un archivo .zip, debes descomprimirlo dentro del directorio de tu servidor Apache , por ejemplo: C:/xampp/htdocs/

2. Base de datos:
   Puedes importar :  mysql -u root -p centro_educativo < backup.sql
   O si prefieres puedes ejecutar el script /data/sql.sql
Luego ajustar las credenciales del archivo /app/config.php

# Estructura del proyecto

├── app/
│   ├── config.php          # Configuración de la base de datos
│   ├── controllers/        # Controladores MVC
│   ├── models/             # Modelos de base de datos
│   └── core/               # Clases principales
├── public/
│   └── index.php           # Front controller
├── view/
│   ├── index.html          # Interfaz principal
│   ├── js/                 # Módulos JavaScript
│   └── css/
├── data/
|   ├── backup.sql
|   └── sql.sql             
├── .htaccess               # Reglas de reescritura de URL
└── backup.sql              # Esquema de la base de datos

