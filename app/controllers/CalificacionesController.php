<?php

class CalificacionesController extends Controller
{
  protected $model;

  public function __construct(array $config)
  {
    parent::__construct($config);
    $this->model = new Calificacion($this->db);
  }

  public function index(Request $request, Response $response)
  {
    $data = $this->model->all();
    $response->json(['success' => true, 'data' => $data]);
  }

  public function store(Request $request, Response $response)
  {
    $b = $request->body;
    if (empty($b['alumno_id']) || empty($b['curso_id']) || !isset($b['calificacion'])) {
      $response->json(['success' => false, 'message' => 'alumno_id, curso_id y calificacion son obligatorios'], 400);
    }

    $cal = filter_var($b['calificacion'], FILTER_VALIDATE_FLOAT);
    if ($cal === false || $cal < 1 || $cal > 12) {
      $response->json(['success' => false, 'message' => 'calificacion debe ser número entre 1 y 12'], 400);
    }


    $stmt = $this->db->prepare("SELECT id FROM alumnos WHERE id=:id");
    $stmt->execute(['id' => $b['alumno_id']]);
    if (!$stmt->fetch()) $response->json(['success' => false, 'message' => 'Alumno no existe'], 400);

    $stmt = $this->db->prepare("SELECT id FROM cursos WHERE id=:id");
    $stmt->execute(['id' => $b['curso_id']]);
    if (!$stmt->fetch()) $response->json(['success' => false, 'message' => 'Curso no existe'], 400);

    try {
      $id = $this->model->create($b);
      $response->json(['success' => true, 'id' => $id], 201);
    } catch (PDOException $e) {
      $response->json(['success' => false, 'message' => $e->getMessage()], 400);
    }
  }

  public function update(Request $request, Response $response, $id)
  {
    $body = $request->body;
    try {
      $calificacion = $this->model->find((int)$id);
      if (!$calificacion) {
        $response->json(['success' => false, 'message' => 'Calificación no encontrada'], 404);
      } else {
        $count = $this->model->update((int)$id, $body);
        $this->logger->info("Updated calificacion id $id, count: $count");
        if ($count > 1) {
          $response->json(['success' => false, 'message' => 'Error: se actualizaron múltiples registros, comuniquece con el administrador'], 500);
        } else {
          $calificacion = $this->model->find((int)$id);
          $response->json(['success' => true, 'message' => "Registros actualizados: $count", 'data' => $calificacion]);
        }
      }
    } catch (Exception $e) {
      $response->json(['success' => false, 'message' => $e->getMessage()], 400);
    }
  }

  public function delete(Request $request, Response $response, $id)
  {
    $calificacion = $this->model->find((int)$id);
    if (!$calificacion) {
      $response->json(['success' => false, 'message' => 'Calificación no encontrada'], 404);
    }

    try {
      $count = $this->model->delete((int)$id);
      if ($count > 1) {
        $response->json(['success' => false, 'message' => 'Error: se eliminaron múltiples registros, comuniquece con el administrador'], 500);
      }
      $response->json(['success' => true, 'message' => 'Calificación eliminada']);
    } catch (PDOException $e) {
      $response->json(['success' => false, 'message' => $e->getMessage()], 400);
    }
  }

  public function show(Request $request, Response $response, $id)
  {
    $calificacion = $this->model->find((int)$id);
    if (!$calificacion) {
      $response->json(['success' => false, 'message' => 'Calificación no encontrada'], 404);
    }
    $response->json(['success' => true, 'data' => $calificacion]);
  }

  public function buscar(Request $request, Response $response)
  {
    $params = $request->query;
    $data = $this->model->search($params);
    $response->json(['success' => true, 'data' => $data]);
  }
}
