<?php

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


    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);


    $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME']);


    if (strpos($uri, $scriptName) === 0) {
      $uri = substr($uri, strlen($scriptName));
    } else {

      $baseDir = dirname($scriptName);
      if (strpos($uri, $baseDir) === 0) {
        $uri = substr($uri, strlen($baseDir));
      }
    }


    $this->path = '/' . ltrim($uri, '/');
    $this->path = rtrim($this->path, '/');
    if ($this->path === '') $this->path = '/';


    $this->headers = function_exists('getallheaders') ? getallheaders() : [];
    $this->body = json_decode(file_get_contents('php://input'), true) ?? [];
    $this->query = $_GET;
  }
}
