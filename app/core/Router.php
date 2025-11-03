<?php
require_once __DIR__ . '/Logger.php';

class Router
{
  private $routes = [];
  private $logger;

  public function __construct()
  {
    $this->logger = new Logger();
  }

  public function add(string $method, string $pattern, string $handler)
  {
    $this->routes[] = [
      'method'  => $method,
      'pattern' => '#^' . $pattern . '$#',
      'handler' => $handler
    ];

    $this->logger->info("Ruta registrada: [{$method}] {$pattern} → {$handler}");
  }

  public function dispatch(Request $request, Response $response, array $config)
  {
    $path   = $request->path;
    $method = $request->method;

    $this->logger->info("Solicitud entrante: [{$method}] {$path}");

    foreach ($this->routes as $route) {
      if ($route['method'] === $method && preg_match($route['pattern'], $path, $matches)) {
        $handler = $route['handler'];
        list($controllerName, $action) = explode('@', $handler);

        $this->logger->info("Coincidencia encontrada → Controlador: $controllerName, Acción: $action");

        if (!class_exists($controllerName)) {
          $this->logger->error("Controlador no encontrado: {$controllerName}");
          throw new Exception("Controlador $controllerName no encontrado", 500);
        }

        $controller = new $controllerName($config);
        array_shift($matches); // remove full match
        $this->logger->info("Ruta coincidente: {$handler}");
        try {

          $result = call_user_func_array([$controller, $action], array_merge([$request, $response], $matches));
          $this->logger->info("Ejecución exitosa de $controllerName@$action");
          return $result;
        } catch (Throwable $t) {
          $this->logger->error("Excepción en $controllerName@$action → " . $t->getMessage());
          throw $t;
        }
      }
    }

    $this->logger->error("Ruta no encontrada: [{$method}] {$path}");
    $response->json(['success' => false, 'message' => 'Ruta no encontrada'], 404);
  }
}
