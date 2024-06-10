<?php

require_once APP_GAMEMODULE_PATH . 'localarena_config.inc.php';
require_once APP_GAMEMODULE_PATH . 'module/LocalArenaContext.php';

class TableParams
{
  public string $game;
  public int $playerCount;

    // Iff true, the "dbmodel.sql" file will be loaded at table
    // creation.  Setting this false is sometimes useful in test
    // situations.
    public bool $load_schema_file = true;

    // Iff set, these schema changes will be applied after the schema file(s) are applied.
    public string $schema_changes = '';

    // Iff set, LocalArena will instantiate the table using
    // $table_class rather than by reading files from disk based on
    // the $game name.
    //
    // This mechanism is intended only for PHPUnit tests.
    public $table_class = null;
}

class TableManager
{
  private $conn;

    private $test_table_classes = [];

  public function __construct()
  {
    // Open the `localarena` database, which is created by the
    // MySQL container.  If it is still empty, initialize it.

    $this->conn = $this::openDatabase('localarena');

    $result = $this->conn->query("SHOW TABLES LIKE 'table'");
    if ($result->num_rows == 0) {
      if (php_sapi_name() == 'cli') {
        echo "*** LocalArena metadata database requires initialization...\n";
      }
      $this->loadFile(APP_GAMEMODULE_PATH . '/module/tablemanager/schema.sql');
    }
  }

  // XXX: Copied from "table.game.php"; move to a shared library.
  function loadFile($filename)
  {
    // Temporary variable, used to store current query
    $templine = '';
    // Read in entire file
    $lines = file($filename);
    // Loop through each line
    foreach ($lines as $line) {
      // Skip it if it's a comment
      if (substr($line, 0, 2) == '--' || $line == '') {
        continue;
      }

      // Add this line to the current segment
      $templine .= $line;
      // If it has a semicolon at the end, it's the end of the query
      if (substr(trim($line), -1, 1) == ';') {
        // Perform the query
        $this->conn->query($templine) or
          (print 'Error performing query \'<strong>' . $templine . '\': ' . $this->conn->error . '<br /><br />');
        // Reset temp variable to empty
        $templine = '';
      }
    }
  }

  public static function openDatabase(string $dbname)
  {
    $servername = getenv('DB_HOST');
    $username = getenv('DB_USER');
    $password = trim(file_get_contents(getenv('DB_PASSWORD_FILE_PATH')));

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Set transaction isolation level so that we can read back
    // changes later in the same transaction.
    $conn->query('SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED');

    return $conn;
  }

  public static function getTableDatabaseName(int $table_id)
  {
    return 'table_' . $table_id;
  }

  public static function getGameClassName(string $game_name)
  {
    return ucfirst($game_name);
  }

  // Returns a `Table` object, or null if no table with that ID
  // exists.
  public function getTable(int $table_id)
  {
    // XXX: look up table id

    $result = $this->conn->query('SELECT * FROM `table` WHERE `table_id` = ' . $table_id);
    if ($result->num_rows == 0) {
      return null;
    }
    $row = mysqli_fetch_assoc($result);

    $dbname = $row['table_database'];
    // XXX: check for null $dbname

    // XXX: we should do this whenever we enter game code, not
    // here (or at least not only here)
    //
    // We need to do this before instantiating the game class.
    LocalArenaContext::get()->table_id = $table_id;

    if (array_key_exists($table_id, $this->test_table_classes)) {
        $table_class = $this->test_table_classes[$table_id];
        $game = new $table_class($dbname);
    } else {
        require_once LOCALARENA_GAME_PATH . $row['table_game'] . '/' . $row['table_game'] . '.game.php';
        $classname = $this::getGameClassName($row['table_game']);
        $game = new $classname($dbname);
    }

    echo '*** XXX: instantiated table: ' . print_r($game,true) . "\n";

    return $game;
  }

  // Creates a table, assigns it an ID, and returns a `Table`
  // object.
  //
  // This will initialize the new table's database, call
  // `setupNewGame()`, and perform any initial state transitions.
  public function createTable(TableParams $params)
  {
    $this->conn->query('INSERT INTO `table` (table_game) VALUES ("' . $params->game . '")');
    $table_id = $this->conn->insert_id;

    $dbname = $this::getTableDatabaseName($table_id);
    $this->conn->query('CREATE DATABASE ' . $dbname);
    $this->conn->query('UPDATE `table` SET `table_database` = "' . $dbname . '" WHERE `table_id` = ' . $table_id);

    if ($params->table_class !== null) {
        $this->test_table_classes[$table_id] = $params->table_class;
    }

    $game = $this->getTable($table_id);
    $game->initTable($params->load_schema_file);

    if ($params->schema_changes !== '') {
        $game->localarenaApplySchema(explode('\n',$params->schema_changes));
    }

    return $game;
  }
}
