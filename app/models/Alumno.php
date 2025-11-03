<?php
// app/models/Alumno.php
class Alumno extends Model
{
  protected $table = 'alumnos';

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
    $sql = "INSERT INTO {$this->table} (nombre, apellido, fecha_nacimiento, email, telefono)
                VALUES (:nombre, :apellido, :fecha_nacimiento, :email, :telefono)";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
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
    $sql = "UPDATE {$this->table} SET nombre=:nombre, apellido=:apellido, fecha_nacimiento=:fecha_nacimiento, email=:email, telefono=:telefono WHERE id=:id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([
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

    // Campos de búsqueda dinámicos
    if (!empty($filters['nombre'])) {
      $sql .= " AND nombre LIKE :nombre";
      $params['nombre'] = '%' . $filters['nombre'] . '%';
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

    // Paginación opcional (limit y offset)
    $limit = isset($filters['limit']) ? (int)$filters['limit'] : 50;
    $offset = isset($filters['offset']) ? (int)$filters['offset'] : 0;

    $sql .= " LIMIT :offset, :limit";

    // Preparar la consulta
    $stmt = $this->db->prepare($sql);

    // Bind manual para LIMIT/OFFSET porque no acepta parámetros nombrados con PDO en MySQL
    foreach ($params as $key => $value) {
      $stmt->bindValue(":$key", $value);
    }
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}
