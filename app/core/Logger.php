<?php
// app/core/Logger.php
class Logger
{
  private string $logFile;

  public function __construct($filePath = null)
  {

    $this->logFile = $filePath ?? __DIR__ . '../../logs/app.log';

    $dir = dirname($this->logFile);
    if (!is_dir($dir)) {
      mkdir($dir, 0777, true);
    }
  }

  /**
   * Escribe un mensaje en el log
   */
  public function write(string $level, string $message): void
  {
    $date = date('Y-m-d H:i:s');
    $entry = sprintf("[%s][%s] %s%s", $date, strtoupper($level), $message, PHP_EOL);
    file_put_contents($this->logFile, $entry, FILE_APPEND);
  }

  /**
   * Métodos helper
   */
  public function info(string $message): void
  {
    $this->write('INFO', $message);
  }

  public function warning(string $message): void
  {
    $this->write('WARNING', $message);
  }

  public function error(string $message): void
  {
    $this->write('ERROR', $message);
  }

  public function debug(string $message): void
  {
    $this->write('DEBUG', $message);
  }
}
