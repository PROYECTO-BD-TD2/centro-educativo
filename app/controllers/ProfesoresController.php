<?php

class ProfesoresController extends Controller
{
  protected $model;

  public function __construct(array $config)
  {
    parent::__construct($config);
    $this->model = new Profesor($this->db);
  }

  public function index(Request $request, Response $response)
  {
    $data = $this->model->all();
    $response->json(['success' => true, 'data' => $data]);
  }

  public function show(Request $request, Response $response, $id)
  {
    $profesor = $this->model->find((int)$id);
    if (!$profesor) {
      $response->json(['success' => false, 'message' => 'Profesor no encontrado'], 404);
    }
    $response->json(['success' => true, 'data' => $profesor]);
  }

  public function store(Request $request, Response $response)
  {
    $body = $request->body;

    $required = ['documento', 'nombre', 'apellido', 'email'];
    foreach ($required as $f) {
      if (empty($body[$f])) {
        $response->json(['success' => false, 'message' => "Campo $f es obligatorio"], 400);
      }
    }

    try {
      $data = $this->model->create($body);
      $response->json(['success' => true, 'message' => 'Profesor creado', 'data' => $data], 201);
    } catch (PDOException $e) {

      $response->json(['success' => false, 'message' => $e->getMessage()], 400);
    }
  }

  public function update(Request $request, Response $response, $id)
  {
    $body = $request->body;
    try {
      $count = $this->model->update((int)$id, $body);
      $response->json(['success' => true, 'message' => "Registros actualizados: $count"]);
    } catch (PDOException $e) {
      $response->json(['success' => false, 'message' => $e->getMessage()], 400);
    }
  }

  public function delete(Request $request, Response $response, $id)
  {
    $count = $this->model->delete((int)$id);
    if ($count === 0) {
      $response->json(['success' => false, 'message' => 'Profesor no encontrado'], 404);
    }
    $response->json(['success' => true, 'message' => 'Profesor eliminado']);
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

  public function getByCurso(Request $request, Response $response, $cursoId)
  {
    $data = $this->model->getByCurso((int)$cursoId);
    $response->json(['success' => true, 'data' => $data]);
  }
}
