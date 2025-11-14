<?php

class Alumno extends Model
{
  protected $table = 'alumnos';

  public function all()
  {
    $stmt = $this->db->query("SELECT * FROM {$this->table}");
    return $stmt->fetchAll();
  }

  public function find(int $id)
  {
    $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->fetch();
  }

  public function create(array $data)
  {
    $sql = "INSERT INTO {$this->table} (documento,nombre, apellido, fecha_nacimiento, email, telefono)
                VALUES (:documento, :nombre, :apellido, :fecha_nacimiento, :email, :telefono)";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'documento' => $data['documento'],
      'nombre' => $data['nombre'],
      'apellido' => $data['apellido'],
      'fecha_nacimiento' => $data['fecha_nacimiento'],
      'email' => $data['email'],
      'telefono' => $data['telefono'] ?? null
    ]);
    return (int)$this->db->lastInsertId();
  }

  public function update(int $id, array $data)
  {
    $sql = "UPDATE {$this->table} SET documento=:documento, nombre=:nombre, apellido=:apellido, fecha_nacimiento=:fecha_nacimiento, email=:email, telefono=:telefono WHERE id=:id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'documento' => $data['documento'],
      'nombre' => $data['nombre'],
      'apellido' => $data['apellido'],
      'fecha_nacimiento' => $data['fecha_nacimiento'],
      'email' => $data['email'],
      'telefono' => $data['telefono'] ?? null,
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

  public function search(array $filters)
  {
    $sql = "SELECT * FROM {$this->table} WHERE 1=1";
    $params = [];


    if (!empty($filters['nombre'])) {
      $sql .= " AND nombre LIKE :nombre";
      $params['nombre'] = '%' . $filters['nombre'] . '%';
    }

    if (!empty($filters['documento'])) {
      $sql .= " AND documento = :documento";
      $params['documento'] = $filters['documento'];
    }

    if (!empty($filters['apellido'])) {
      $sql .= " AND apellido LIKE :apellido";
      $params['apellido'] = '%' . $filters['apellido'] . '%';
    }

    if (!empty($filters['email'])) {
      $sql .= " AND email LIKE :email";
      $params['email'] = '%' . $filters['email'] . '%';
    }

    if (!empty($filters['telefono'])) {
      $sql .= " AND telefono LIKE :telefono";
      $params['telefono'] = '%' . $filters['telefono'] . '%';
    }

    if (!empty($filters['fecha_nacimiento'])) {
      $sql .= " AND fecha_nacimiento = :fecha_nacimiento";
      $params['fecha_nacimiento'] = $filters['fecha_nacimiento'];
    }


    $stmt = $this->db->prepare($sql);


    foreach ($params as $key => $value) {
      $stmt->bindValue(":$key", $value);
    }

    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}
