<?php

class AlumnosController extends Controller
{
  protected $model;

  public function __construct(array $config)
  {
    parent::__construct($config);
    $this->model = new Alumno($this->db);
  }

  public function index(Request $request, Response $response)
  {
    $data = $this->model->all();
    // $this->logger->info("Fetched " . $data . " alumnos");
    $response->json(['success' => true, 'data' => $data]);
  }

  public function show(Request $request, Response $response, $id)
  {
    $alumno = $this->model->find((int)$id);
    if (!$alumno) {
      $response->json(['success' => false, 'message' => 'Alumno no encontrado'], 404);
    }
    $response->json(['success' => true, 'data' => $alumno]);
  }

  public function store(Request $request, Response $response)
  {
    $body = $request->body;
    $this->logger->info("Storing new alumno" . json_encode($body));

    $required = ['documento', 'nombre', 'apellido', 'fecha_nacimiento', 'email'];
    foreach ($required as $f) {
      if (empty($body[$f])) {
        $response->json(['success' => false, 'message' => "Campo $f es obligatorio"], 400);
      }
    }

    try {
      $id = $this->model->create($body);
      $alumno = $this->model->find($id);
      $response->json(['success' => true, 'message' => 'Alumno creado', 'data' => $alumno], 201);
    } catch (Exception  $e) {
      $this->logger->error("Error creating alumno: " . $e->getMessage());
      $response->json(['success' => false, 'message' => $e->getMessage()], 400);
    }
  }

  public function update(Request $request, Response $response, $id)
  {
    $body = $request->body;
    try {
      $alumno = $this->model->find((int)$id);
      if (!$alumno) {
        $response->json(['success' => false, 'message' => 'Alumno no encontrado'], 404);
      } else {
        $count = $this->model->update((int)$id, $body);
        if ($count > 1) {
          $response->json(['success' => false, 'message' => 'Error: se actualizaron múltiples registros, comuniquece con el administrador'], 500);
        } else {
          $alumno = $this->model->find((int)$id);
          $response->json(['success' => true, 'message' => "Registros actualizados: $count", 'data' => $alumno]);
        }
      }
    } catch (PDOException $e) {
      $response->json(['success' => false, 'message' => $e->getMessage()], 400);
    }
  }

  public function delete(Request $request, Response $response, $id)
  {
    $count = $this->model->delete((int)$id);
    if ($count === 0) {
      $response->json(['success' => false, 'message' => 'Alumno no encontrado'], 404);
    }
    $response->json(['success' => true, 'message' => 'Alumno eliminado']);
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
