<?php

declare(strict_types=1);

require_once __DIR__ . '/../app/config.php';
require_once __DIR__ . '/../app/core/Router.php';
require_once __DIR__ . '/../app/core/Request.php';
require_once __DIR__ . '/../app/core/Response.php';
require_once __DIR__ . '/../app/core/Controller.php';
require_once __DIR__ . '/../app/core/Model.php';

$logger = new Logger();

spl_autoload_register(function ($class) {
  $paths = [__DIR__ . '/../app/controllers/', __DIR__ . '/../app/models/'];
  foreach ($paths as $p) {
    $file = $p . $class . '.php';
    if (file_exists($file)) {
      require_once $file;
      return;
    }
  }
});

$config = require __DIR__ . '/../app/config.php';


$router = new Router();


$router->add('GET',  '/alumnos',               'AlumnosController@index');
$router->add('GET',  '/alumnos/(\d+)',        'AlumnosController@show');
$router->add('POST', '/alumnos',               'AlumnosController@store');
$router->add('PUT',  '/alumnos/(\d+)',        'AlumnosController@update');
$router->add('DELETE', '/alumnos/(\d+)',       'AlumnosController@delete');
$router->add('GET', '/alumnos/buscar',         'AlumnosController@buscar');

$router->add('GET',  '/profesores',           'ProfesoresController@index');
$router->add('GET',  '/profesores/(\d+)',    'ProfesoresController@show');
$router->add('POST', '/profesores',           'ProfesoresController@store');
$router->add('PUT',  '/profesores/(\d+)',    'ProfesoresController@update');
$router->add('DELETE', '/profesores/(\d+)',       'ProfesoresController@delete');
$router->add('GET', '/profesores/buscar',       'ProfesoresController@buscar');
$router->add('GET', '/profesores/curso/(\d+)',  'ProfesoresController@getByCurso');

$router->add('GET',  '/cursos',               'CursosController@index');
$router->add('GET',  '/cursos/(\d+)',        'CursosController@show');
$router->add('POST', '/cursos',               'CursosController@store');
$router->add('PUT',  '/cursos/(\d+)',        'CursosController@update');
$router->add('DELETE', '/cursos/(\d+)',       'CursosController@delete');
$router->add('GET', '/cursos/buscar',         'CursosController@buscar');
$router->add('GET',  '/cursos/alumno/(\d+)', 'CursosController@forAlumno');
$router->add('GET',  '/cursos/profesor/(\d+)', 'CursosController@forProfesor');

$router->add('GET',  '/inscripciones',        'InscripcionesController@index');
$router->add('GET',  '/inscripciones/(\d+)', 'InscripcionesController@show');
$router->add('POST', '/inscripciones',        'InscripcionesController@store');
$router->add('PUT',  '/inscripciones/(\d+)', 'InscripcionesController@update');
$router->add('DELETE', '/inscripciones/(\d+)', 'InscripcionesController@delete');
$router->add('GET', '/inscripciones/buscar',    'InscripcionesController@buscar');

$router->add('GET',  '/calificaciones',       'CalificacionesController@index');
$router->add('GET',  '/calificaciones/(\d+)', 'CalificacionesController@show');
$router->add('POST', '/calificaciones',        'CalificacionesController@store');
$router->add('PUT',  '/calificaciones/(\d+)', 'CalificacionesController@update');
$router->add('DELETE', '/calificaciones/(\d+)', 'CalificacionesController@delete');
$router->add('GET', '/calificaciones/buscar',    'CalificacionesController@buscar');

$request = new Request();
$response = new Response();


try {
  $logger->info("Solicitud entrante: [{$request->method}] {$request->path}");
  $router->dispatch($request, $response, $config);
} catch (Exception $e) {
  $response->json(['success' => false, 'message' => $e->getMessage()], 500);
}
