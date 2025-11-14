<?php
// app/models/Inscripcion.php
class Inscripcion extends Model
{
  protected $table = 'inscripciones';

  public function all()
  {
    return $this->db->query("SELECT * FROM {$this->table}")->fetchAll();
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
    $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = :id");
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
