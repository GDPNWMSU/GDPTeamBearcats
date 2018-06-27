<?php
require 'db_config.php';

class Helper
{
	public function getFileType($MIME)
	{
    $MIME = 'application/'.$MIME;
		$sql="SELECT `FILE_TYPE` FROM `mime_file_types` WHERE `MIME` = ".'"'.$MIME.'"';
		$result=mysqli_query($GLOBALS['conn'],$sql);
		if ($result)
		  {
        while ($row = $result->fetch_assoc()) {
        // echo var_dump($row);
            return $row['FILE_TYPE'];
        }
		  mysqli_free_result($result);
		}
	}
  public function getLastImportedFile()
  {
    $sql="SELECT * FROM `IMPORTED_FILES` ORDER BY ID DESC LIMIT 1";
    $result=mysqli_query($GLOBALS['conn'],$sql);
    if ($result)
      {
        while ($row = $result->fetch_assoc()) {
        // echo var_dump($row);
            return [$row['FILE_TYPE'],$row['FILE_PATH'],$row['FILE_NAME']];
        }
      mysqli_free_result($result);
    }
  }
}
