<?php

class Controller
{
  protected $config;
  protected $db;
  protected $logger;
  public function __construct(array $config)
  {
    $this->config = $config;
    $dbconf = $config['db'];
    $dsn = "mysql:host={$dbconf['host']};dbname={$dbconf['dbname']}";
    $opt = [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ];
    $this->db = new PDO($dsn, $dbconf['user'], $dbconf['pass'], $opt);
    $this->logger = new Logger();
  }
}
