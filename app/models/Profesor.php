<?php
// app/models/Profesor.php
class Profesor extends Model
{
  protected $table = 'profesores';

  public function all()
  {
    $stmt = $this->db->query("SELECT * FROM {$this->table}");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function find(int $id)
  {
    $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function create(array $data)
  {
    $sql = "INSERT INTO {$this->table} (nombre, apellido, email, telefono)
            VALUES (:nombre, :apellido, :email, :telefono)";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'nombre' => $data['nombre'],
      'apellido' => $data['apellido'],
      'email' => $data['email'],
      'telefono' => $data['telefono'] ?? null
    ]);

    $id = (int)$this->db->lastInsertId();

    return $this->find($id);
  }


  public function update(int $id, array $data)
  {
    $sql = "UPDATE {$this->table} SET nombre=:nombre, apellido=:apellido, email=:email, telefono=:telefono WHERE id=:id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'nombre' => $data['nombre'],
      'apellido' => $data['apellido'],
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
}
