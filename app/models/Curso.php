<?php

class Curso extends Model
{
  protected $table = 'cursos';

  public function all()
  {
    $stmt = $this->db->query("SELECT {$this->table}.*, profesores.documento as profesor_documento FROM {$this->table} left join profesores ON cursos.profesor_id = profesores.id");
    return $stmt->fetchAll();
  }

  public function find(int $id)
  {
    $stmt = $this->db->prepare("SELECT {$this->table}.*, profesores.nombre as profesor_nombre, profesores.documento as profesor_documento FROM {$this->table} left join profesores ON cursos.profesor_id = profesores.id WHERE cursos.id = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->fetch();
  }

  public function create(array $data)
  {
    $sql = "INSERT INTO {$this->table} (nombre, descripcion, profesor_id)
                VALUES (:nombre, :descripcion, :profesor_id)";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'nombre' => $data['nombre'],
      'descripcion' => $data['descripcion'],
      'profesor_id' => $data['profesor_id'] ?? null
    ]);
    return (int)$this->db->lastInsertId();
  }

  public function update(int $id, array $data)
  {
    $sql = "UPDATE {$this->table} SET nombre=:nombre, descripcion=:descripcion, profesor_id=:profesor_id WHERE id=:id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'nombre' => $data['nombre'],
      'descripcion' => $data['descripcion'],
      'profesor_id' => $data['profesor_id'] ?? null,
      'id' => $id
    ]);
    return $stmt->rowCount();
  }

  public function delete(int $id)
  {
    $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->rowCount();
  }

  public function getByAlumno(int $alumnoId)
  {
    $sql = "SELECT c.id as curso_id, c.nombre 
            FROM alumnos a
            JOIN inscripciones i ON i.alumno_id = a.id
            JOIN cursos c ON i.curso_id = c.id
            WHERE i.alumno_id = :alumno_id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(['alumno_id' => $alumnoId]);
    return $stmt->fetchAll();
  }

  public function getByProfesor(int $profesorId)
  {
    $sql = "SELECT p.nombre as profesor_nombre, p.documento as profesor_documento, p.id as profesor_id, p.apellido as profesor_apellido
            FROM cursos c
            jOIN profesores p ON c.profesor_id = p.id 
            WHERE c.profesor_id = :profesor_id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(['profesor_id' => $profesorId]);
    return $stmt->fetchAll();
  }
}
