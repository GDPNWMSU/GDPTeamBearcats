<?php
require 'db_config.php';
include 'helper.php';
$target_path = "./imported_Files/";
$file_target_path = $target_path . basename( $_FILES['Filename']['name']);
$Filename=basename( $_FILES['Filename']['name']);
$MIME=basename( $_FILES['Filename']['type']);
$Server_File_Name = $_FILES['Filename']['tmp_name'];
// echo"<pre>".print_r($_FILES,true)."</pre>";
$helper = new Helper();
$FileType = $helper->getFileType($MIME);

if(move_uploaded_file($_FILES['Filename']['tmp_name'], $file_target_path)) {
    echo "The file ". basename( $_FILES['Filename']['name']). " has been uploaded, and your information has been added to the directory";
    $sql = "INSERT INTO `IMPORTED_FILES` (FILE_NAME,FILE_PATH,FILE_TYPE)
    VALUES ('$Filename', '$target_path','$FileType')";
    if (mysqli_query($GLOBALS['conn'], $sql)) {
      echo "Successfully inserted into database";
      ?>
      <script type="text/javascript">
      	window.location.href="Excel_Parser.php"
      </script>
      <?php
    }
} else {
    //Gives and error if its not
    echo "Sorry, there was a problem uploading your file.";
}



 ?>
