<?php
// app/core/Model.php
class Model
{
  protected $db;
  protected $logger;
  public function __construct(PDO $db)
  {
    $this->db = $db;
    $this->logger = new Logger();
  }
}
