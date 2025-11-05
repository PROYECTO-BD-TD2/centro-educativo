<?php
// app/models/Calificacion.php
class Calificacion extends Model
{
  protected $table = 'calificaciones';

  public function all()
  {
    return $this->db->query("SELECT * FROM {$this->table}")->fetchAll(PDO::FETCH_ASSOC);
  }

  private function find(int $id)
  {
    $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function create(array $data)
  {
    $sql = "INSERT INTO {$this->table} (alumno_id, curso_id, calificacion) VALUES (:alumno_id, :curso_id, :calificacion)";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'alumno_id' => $data['alumno_id'],
      'curso_id' => $data['curso_id'],
      'calificacion' => $data['calificacion']
    ]);
    $id = (int)$this->db->lastInsertId();
    return $this->find($id);
  }

  public function update(int $id, array $data)
  {
    $sql = "UPDATE {$this->table} SET alumno_id=:alumno_id, curso_id=:curso_id, calificacion=:calificacion, fecha_calificacion=:fecha_calificacion WHERE id=:id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'alumno_id' => $data['alumno_id'],
      'curso_id' => $data['curso_id'],
      'calificacion' => $data['calificacion'],
      'fecha_calificacion' => $data['fecha_calificacion'],
      'id' => $id
    ]);
    return $this->find($id);
  }
}
