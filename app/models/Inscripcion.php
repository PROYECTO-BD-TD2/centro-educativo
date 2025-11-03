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
    $sql = "INSERT INTO {$this->table} (alumno_id, curso_id, fecha_inscripcion) VALUES (:alumno_id, :curso_id, :fecha_inscripcion)";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'alumno_id' => $data['alumno_id'],
      'curso_id' => $data['curso_id'],
      'fecha_inscripcion' => $data['fecha_inscripcion'] ?? date('Y-m-d')
    ]);
    return (int)$this->db->lastInsertId();
  }
}
