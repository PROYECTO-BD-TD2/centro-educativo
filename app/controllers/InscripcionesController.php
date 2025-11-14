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

  public function show(Request $request, Response $response, $id)
  {
    $inscripcion = $this->model->find((int)$id);
    if (!$inscripcion) {
      $response->json(['success' => false, 'message' => 'Inscripción no encontrada'], 404);
    }
    $response->json(['success' => true, 'data' => $inscripcion]);
  }

  public function store(Request $request, Response $response)
  {
    $b = $request->body;
    if (empty($b['alumno_id']) || empty($b['curso_id'])) {
      $response->json(['success' => false, 'message' => 'alumno_id y curso_id son obligatorios'], 400);
    }

    try {
      $id = $this->model->create($b);
      $inscripcion = $this->model->find($id);
      $response->json(['success' => true, 'message' => 'Inscripción creada', 'data' => $inscripcion], 201);
    } catch (PDOException $e) {
      $response->json(['success' => false, 'message' => $e->getMessage()], 400);
    }
  }

  public function update(Request $request, Response $response, $id)
  {
    $b = $request->body;
    try {
      $calificacion = $this->model->find((int)$id);
      if (!$calificacion) {
        $response->json(['success' => false, 'message' => 'Inscripción no encontrada'], 404);
      } else {
        $count = $this->model->update((int)$id, $b);
        if ($count > 1) {
          $response->json(['success' => false, 'message' => 'Error: se actualizaron múltiples registros, comuniquece con el administrador'], 500);
        } else {
          $inscripcion = $this->model->find((int)$id);
          $response->json(['success' => true, 'message' => "Registros actualizados: $count", 'data' => $inscripcion]);
        }
      }
    } catch (Exception $e) {
      $response->json(['success' => false, 'message' => $e->getMessage()], 400);
    }
  }

  public function delete(Request $request, Response $response, $id)
  {
    try {
      $count = $this->model->delete((int)$id);
      if ($count === 0) {
        $response->json(['success' => false, 'message' => 'Inscripción no encontrada'], 404);
      } else if ($count > 1) {
        $response->json(['success' => false, 'message' => 'Error: se eliminaron múltiples registros, comuniquece con el administrador'], 500);
      } else {
        $response->json(['success' => true, 'message' => "Inscripción eliminada correctamente"]);
      }
    } catch (PDOException $e) {
      $response->json(['success' => false, 'message' => $e->getMessage()], 400);
    }
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
