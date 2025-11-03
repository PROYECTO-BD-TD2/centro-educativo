<?php
// app/core/Request.php
class Request
{
  public $method;
  public $path;
  public $headers;
  public $body;
  public $query;

  public function __construct()
  {
    $this->method = $_SERVER['REQUEST_METHOD'];

    // URI completa solicitada (por ejemplo: /developer/proyrcto-final-DB/public/index.php/alumnos)
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    // Detectar el script base automáticamente (por ejemplo: /developer/proyrcto-final-DB/public/index.php)
    $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME']);

    // Eliminar el prefijo del script de la URI
    if (strpos($uri, $scriptName) === 0) {
      $uri = substr($uri, strlen($scriptName));
    } else {
      // Si no coincide exacto, intentar sin index.php
      $baseDir = dirname($scriptName);
      if (strpos($uri, $baseDir) === 0) {
        $uri = substr($uri, strlen($baseDir));
      }
    }

    // Limpiar y normalizar el path final
    $this->path = '/' . ltrim($uri, '/');
    $this->path = rtrim($this->path, '/');
    if ($this->path === '') $this->path = '/';

    // Capturar headers, body y query
    $this->headers = function_exists('getallheaders') ? getallheaders() : [];
    $this->body = json_decode(file_get_contents('php://input'), true) ?? [];
    $this->query = $_GET;
  }
}
