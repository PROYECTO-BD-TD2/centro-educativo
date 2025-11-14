CREATE DATABASE centro_educativo;
USE centro_educativo;

-- Tabla: alumnos
CREATE TABLE alumnos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(50)
);

-- Tabla: profesores
CREATE TABLE profesores (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(50)
) ;

-- Tabla: cursos
CREATE TABLE cursos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  profesor_id BIGINT,
  CONSTRAINT fk_cursos_profesor   FOREIGN KEY (profesor_id) REFERENCES profesores (id) ON DELETE SET NULL
);

CREATE INDEX idx_cursos_profesor_id ON cursos (profesor_id);

-- Tabla: inscripciones
CREATE TABLE inscripciones (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  alumno_id BIGINT NOT NULL,
  curso_id BIGINT NOT NULL,
  fecha_inscripcion DATE NOT NULL DEFAULT (CURRENT_DATE),
  CONSTRAINT fk_inscripciones_alumno  FOREIGN KEY (alumno_id)  REFERENCES alumnos (id) ON DELETE CASCADE,
  CONSTRAINT fk_inscripciones_curso   FOREIGN KEY (curso_id)   REFERENCES cursos (id)  ON DELETE CASCADE,
  CONSTRAINT uq_inscripciones_alumno_curso  UNIQUE (alumno_id, curso_id)  
) ;

CREATE INDEX idx_inscripciones_alumno_id ON inscripciones (alumno_id);
CREATE INDEX idx_inscripciones_curso_id ON inscripciones (curso_id);

-- Tabla: calificaciones
CREATE TABLE calificaciones (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  alumno_id BIGINT NOT NULL,
  curso_id BIGINT NOT NULL,
  calificacion DECIMAL(5,2),
  fecha_calificacion DATE NOT NULL DEFAULT (CURRENT_DATE),
  CONSTRAINT fk_calificaciones_alumno FOREIGN KEY (alumno_id)  REFERENCES alumnos (id) ON DELETE CASCADE,
  CONSTRAINT fk_calificaciones_curso FOREIGN KEY (curso_id)  REFERENCES cursos (id)  ON DELETE CASCADE,
  CONSTRAINT uq_calificaciones_alumno_curso UNIQUE (alumno_id, curso_id) 
);

CREATE INDEX idx_calificaciones_alumno_id ON calificaciones (alumno_id);
CREATE INDEX idx_calificaciones_curso_id ON calificaciones (curso_id);

ALTER TABLE alumnos ADD documento VARCHAR(50) NOT NULL UNIQUE;
ALTER TABLE profesores ADD documento VARCHAR(50) NOT NULL UNIQUE;