<?php
// app/models/Calificacion.php
class Calificacion extends Model
{
  protected $table = 'calificaciones';

  public function all()
  {
    return $this->db->query("SELECT * FROM {$this->table}")->fetchAll(PDO::FETCH_ASSOC);
  }

  public function create(array $data)
  {
    $sql = "INSERT INTO {$this->table} (alumno_id, curso_id, calificacion, fecha_calificacion) VALUES (:alumno_id, :curso_id, :calificacion, :fecha_calificacion)";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'alumno_id' => $data['alumno_id'],
      'curso_id' => $data['curso_id'],
      'calificacion' => $data['calificacion'],
      'fecha_calificacion' => $data['fecha_calificacion'] ?? date('Y-m-d')
    ]);
    return (int)$this->db->lastInsertId();
  }
}
