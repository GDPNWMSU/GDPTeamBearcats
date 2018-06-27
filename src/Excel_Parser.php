<?php
/* Contribution
  Day 1: Parsed Excel sheet using getSheetByName() method.
  Day 2: Displayed parsed excel data into tables and also included bootstrap for styling
*/
require 'libraries/PhpSpreadsheet-develop/vendor/autoload.php';
require 'Header.php';
include 'helper.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;
$helper = new Helper();
// $inputFileType = 'Xlsx';
$file_details = $helper->getLastImportedFile();
if(count($file_details)>1){
$inputFileType = ucwords(substr($file_details[0],1));
// $inputFileName = 'sample_data/test.xlsx';
$inputFileName = $file_details[1].$file_details[2];
$reader = IOFactory::createReader($inputFileType);
$spreadsheet = $reader->load($inputFileName);
$sheetCount = $spreadsheet->getSheetCount();
$sheetNames = $spreadsheet->getSheetNames();
?>
<a href="../" class="btn btn-primary">Upload another file</a>
<?php
foreach ($sheetNames as $sheetIndex => $sheetName) {
    echo "<br />\n";
    echo '<strong>WorkSheet Name:</strong> '.$sheetName;
    echo "<br />\n";
    $sheetData = $spreadsheet->getSheetByName($sheetName)->toArray(null, true, true, true);
    ?>
<table class="table table-bordered table-striped">
      <tbody>
  <?php
    $count = 0;
    foreach ($sheetData as $columnName => $columnData) {
      echo "<tr>";
      foreach ($columnData  as $key => $value) {
            if ($count<count($columnData)) {
              echo "<th>".$value."</th>";
            }else{
              echo "<td>".$value."</td>";
            }
            $count++;
        }
            echo "</tr>";
        }
          $count++;
          echo "<br />\n";
          echo "</tbody></table>";
}
}
