<?php

class Calificacion extends Model
{
  protected $table = 'calificaciones';

  public function all()
  {
    $query = " SELECT 
                cal.*, 
                  a.id as alumno_id,
                  a.documento AS alumno_documento,
                  a.nombre AS alumno_nombre,
                  a.apellido AS alumno_apellido,
                  c.id as curso_id,
                  c.nombre AS curso_nombre,
                  p.id as profesor_id,
                  p.documento AS profesor_documento,
                  p.nombre AS profesor_nombre,
                  p.apellido AS profesor_apellido
            FROM {$this->table} cal
            JOIN alumnos a ON cal.alumno_id = a.id
            JOIN cursos c ON cal.curso_id = c.id
            JOIN profesores p ON cal.profesor_id = p.id";
    return $this->db->query($query)->fetchAll();
  }

  public function find(int $id)
  {

    $query = "SELECT 
              cal.*, 
              a.id as alumno_id,
              a.documento AS alumno_documento,
              a.nombre AS alumno_nombre,
              a.apellido AS alumno_apellido,
              c.id as curso_id,
              c.nombre AS curso_nombre,
              p.id as profesor_id,
              p.documento AS profesor_documento,
              p.nombre AS profesor_nombre,
              p.apellido AS profesor_apellido
              FROM {$this->table} cal
              JOIN alumnos a ON cal.alumno_id = a.id
              JOIN cursos c ON cal.curso_id = c.id
              JOIN profesores p ON cal.profesor_id = p.id
              WHERE cal.id = :id";
    $stmt = $this->db->prepare($query);
    $stmt->execute(['id' => $id]);
    return $stmt->fetch();
  }

  public function create(array $data)
  {
    $sql = "INSERT INTO {$this->table} (alumno_id, curso_id, profesor_id, calificacion) VALUES (:alumno_id, :curso_id, :profesor_id, :calificacion)";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'alumno_id' => $data['alumno_id'],
      'curso_id' => $data['curso_id'],
      'profesor_id' => $data['profesor_id'],
      'calificacion' => $data['calificacion']
    ]);
    $id = (int)$this->db->lastInsertId();
    return $this->find($id);
  }

  public function update(int $id, array $data)
  {
    $sql = "UPDATE {$this->table} SET alumno_id=:alumno_id, profesor_id=:profesor_id, curso_id=:curso_id, calificacion=:calificacion, fecha_calificacion=:fecha_calificacion WHERE id=:id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
      'alumno_id' => $data['alumno_id'],
      'profesor_id' => $data['profesor_id'],
      'curso_id' => $data['curso_id'],
      'calificacion' => $data['calificacion'],
      'fecha_calificacion' => $data['fecha_calificacion'],
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

  public function search(array $params)
  {
    $conditions = [];
    $values = [];

    if (isset($params['alumno_id'])) {
      $conditions[] = 'alumno_id = :alumno_id';
      $values['alumno_id'] = $params['alumno_id'];
    }

    if (isset($params['curso_id'])) {
      $conditions[] = 'curso_id = :curso_id';
      $values['curso_id'] = $params['curso_id'];
    }

    if (isset($params['min_calificacion'])) {
      $conditions[] = 'calificacion >= :min_calificacion';
      $values['min_calificacion'] = $params['min_calificacion'];
    }

    if (isset($params['max_calificacion'])) {
      $conditions[] = 'calificacion <= :max_calificacion';
      $values['max_calificacion'] = $params['max_calificacion'];
    }

    $sql = "SELECT * FROM {$this->table}";
    if (!empty($conditions)) {
      $sql .= ' WHERE ' . implode(' AND ', $conditions);
    }

    $stmt = $this->db->prepare($sql);
    $stmt->execute($values);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}
