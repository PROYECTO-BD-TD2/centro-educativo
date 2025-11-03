<?php
// app/core/Model.php
class Model
{
  protected $db;

  public function __construct(PDO $db)
  {
    $this->db = $db;
  }
}
