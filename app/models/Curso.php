<?php

class Curso extends Model
{
  protected $table = 'cursos';

  public function all()
  {
    $stmt = $this->db->query("SELECT {$this->table}.*, profesores.nombre as profesor_nombre FROM {$this->table} left join profesores ON cursos.profesor_id = profesores.id");
    return $stmt->fetchAll();
  }

  public function find(int $id)
  {
    $stmt = $this->db->prepare("SELECT {$this->table}.*, profesores.nombre as profesor_nombre FROM {$this->table} left join profesores ON cursos.profesor_id = profesores.id WHERE cursos.id = :id");
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
}
