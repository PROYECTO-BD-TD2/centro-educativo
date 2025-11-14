<?php

class CursosController extends Controller
{
  protected $model;

  public function __construct(array $config)
  {
    parent::__construct($config);
    $this->model = new Curso($this->db);
  }

  public function index(Request $request, Response $response)
  {
    $data = $this->model->all();
    $response->json(['success' => true, 'data' => $data]);
  }

  public function show(Request $request, Response $response, $id)
  {
    $curso = $this->model->find((int)$id);
    if (!$curso) $response->json(['success' => false, 'message' => 'Curso no encontrado'], 404);
    $response->json(['success' => true, 'data' => $curso]);
  }

  public function store(Request $request, Response $response)
  {
    $b = $request->body;
    if (empty($b['nombre'])) $response->json(['success' => false, 'message' => 'nombre obligatorio'], 400);
    // verificar si profesor existe cuando se envía profesor_id
    if (!empty($b['profesor_id'])) {
      $stmt = $this->db->prepare("SELECT id FROM profesores WHERE id = :id");
      $stmt->execute(['id' => $b['profesor_id']]);
      if (!$stmt->fetch()) $response->json(['success' => false, 'message' => 'profesor_id inválido'], 400);
    }
    $id = $this->model->create($b);
    $response->json(['success' => true, 'id' => $id], 201);
  }

  public function delete(Request $request, Response $response, $id)
  {
    $curso = $this->model->find((int)$id);
    if (!$curso) {
      $response->json(['success' => false, 'message' => 'Curso no encontrado'], 404);
    }
    $count = $this->model->delete((int)$id);
    if ($count > 1) {
      $response->json(['success' => false, 'message' => 'Error: se eliminaron múltiples registros, comuniquece con el administrador'], 500);
    }
    $response->json(['success' => true, 'message' => 'Curso eliminado']);
  }

  public function update(Request $request, Response $response, $id)
  {
    $curso = $this->model->find((int)$id);
    if (!$curso) {
      $response->json(['success' => false, 'message' => 'Curso no encontrado'], 404);
    }
    $b = $request->body;
    if (empty($b['nombre'])) {
      $response->json(['success' => false, 'message' => 'nombre obligatorio'], 400);
    }
    // verificar si profesor existe cuando se envía profesor_id
    if (!empty($b['profesor_id'])) {
      $stmt = $this->db->prepare("SELECT id FROM profesores WHERE id = :id");
      $stmt->execute(['id' => $b['profesor_id']]);
      if (!$stmt->fetch()) {
        $response->json(['success' => false, 'message' => 'profesor_id inválido'], 400);
      }
    }
    $count = $this->model->update((int)$id, $b);
    if ($count > 1) {
      $response->json(['success' => false, 'message' => 'Error: se actualizaron múltiples registros, comuniquece con el administrador'], 500);
    }
    $response->json(['success' => true, 'message' => 'Curso actualizado']);
  }

  public function buscar(Request $req, Response $res)
  {
    $params = $req->query;
    $result = $this->model->search($params);

    if (!empty($result)) {
      return $res->json(['success' => true, 'data' => $result]);
    } else {
      return $res->json(['success' => false, 'message' => 'No se encontraron resultados']);
    }
  }
}
