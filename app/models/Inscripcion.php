<?php

class Inscripcion extends Model
{
  protected $table = 'inscripciones';

  public function all()
  {
    $qry = "SELECT i.*, 
    a.id as alumno_id,
    a.documento AS alumno_documento,
    a.nombre as alumno_nombre,
    a.apellido as alumno_apellido,
    c.id as curso_id,
    c.nombre as curso_nombre
    FROM {$this->table} i 
    JOIN alumnos a ON i.alumno_id = a.id
    JOIN cursos c ON i.curso_id = c.id";
    return $this->db->query($qry)->fetchAll();
  }

  public function create(array $data)
  {
    $sql = "INSERT INTO {$this->table} (alumno_id, curso_id) VALUES (:alumno_id, :curso_id)";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'alumno_id' => $data['alumno_id'],
      'curso_id' => $data['curso_id']
    ]);
    return (int)$this->db->lastInsertId();
  }

  public function find(int $id)
  {
    $qry = "SELECT i.*, 
    a.id as alumno_id,
    a.documento AS alumno_documento,
    a.nombre as alumno_nombre,
    a.apellido as alumno_apellido,
    c.id as curso_id,
    c.nombre as curso_nombre
    FROM {$this->table} i
    JOIN alumnos a ON i.alumno_id = a.id
    JOIN cursos c ON i.curso_id = c.id
    WHERE i.id = :id";
    $stmt = $this->db->prepare($qry);
    $stmt->execute(['id' => $id]);
    return $stmt->fetch();
  }

  public function delete(int $id)
  {
    $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->rowCount();
  }

  public function update(int $id, array $data)
  {
    $sql = "UPDATE {$this->table} SET alumno_id=:alumno_id, curso_id=:curso_id WHERE id=:id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'alumno_id' => $data['alumno_id'],
      'curso_id' => $data['curso_id'],
      'id' => $id
    ]);
    return $stmt->rowCount();
  }
}
