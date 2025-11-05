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
}
