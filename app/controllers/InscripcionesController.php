<?php
// app/controllers/InscripcionesController.php
class InscripcionesController extends Controller
{
  protected $model;

  public function __construct(array $config)
  {
    parent::__construct($config);
    $this->model = new Inscripcion($this->db);
  }

  public function index(Request $request, Response $response)
  {
    $data = $this->model->all();
    $response->json(['success' => true, 'data' => $data]);
  }

  public function store(Request $request, Response $response)
  {
    $b = $request->body;
    if (empty($b['alumno_id']) || empty($b['curso_id'])) {
      $response->json(['success' => false, 'message' => 'alumno_id y curso_id son obligatorios'], 400);
    }

    // Validar existencia alumno y curso
    $stmt = $this->db->prepare("SELECT id FROM alumnos WHERE id=:id");
    $stmt->execute(['id' => $b['alumno_id']]);
    if (!$stmt->fetch()) $response->json(['success' => false, 'message' => 'Alumno no existe'], 400);

    $stmt = $this->db->prepare("SELECT id FROM cursos WHERE id=:id");
    $stmt->execute(['id' => $b['curso_id']]);
    if (!$stmt->fetch()) $response->json(['success' => false, 'message' => 'Curso no existe'], 400);

    // Insertar con manejo de transacción y control de duplicados
    try {
      $this->db->beginTransaction();
      $id = $this->model->create($b); // crear método en modelo Inscripcion
      $this->db->commit();
      $response->json(['success' => true, 'id' => $id], 201);
    } catch (PDOException $e) {
      $this->db->rollBack();
      $response->json(['success' => false, 'message' => $e->getMessage()], 400);
    }
  }
}
