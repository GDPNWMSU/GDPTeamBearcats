<?php
/* Contribution
  Day 1: Parsed Excel sheet using getSheetByName() method.
  Day 2: Displayed parsed excel data into tables and also included bootstrap for styling
*/
require 'libraries/PhpSpreadsheet-develop/vendor/autoload.php';
require 'Header.php';
include 'helper.php';
ini_set('memory_limit', '512M');
ini_set('max_execution_time', 123456);
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
$reader->setReadDataOnly(true);
$spreadsheet = $reader->load($inputFileName);
$sheetCount = $spreadsheet->getSheetCount();
$sheetNames = $spreadsheet->getSheetNames();
?>
<a href="./" class="btn btn-primary">Upload another file</a>
<?php

foreach ($sheetNames as $sheetIndex => $sheetName) {
  $tableID=str_replace(' ', '', $sheetName);
  $tableID=str_replace('#', '', $tableID);

  ?>
  <script type="text/javascript">
  $(document).ready( function () {
    $('<?php echo "#".$tableID;?>').DataTable();
  } );
  </script>
  <?php
    echo "<br />\n";
    echo '<strong>WorkSheet Name:</strong> '.$sheetName;
    echo "<br />\n";
    $sheetData = $spreadsheet->getSheetByName($sheetName)->toArray(null, true, true, true);
    // $highestRow = $spreadsheet->getSheetByName($sheetName)->getHighestRow();
    //
    // $highestCol = $spreadsheet->getSheetByName($sheetName)->getHighestColumn();
    // echo $highestCol."----".$highestRow;
    // $sheetData = $spreadsheet->getSheetByName($sheetName)->rangeToArray("A1:$highestCol$highestRow", null, true, false, false);
    ?>
    <table class="table table-bordered table-striped" id="<?php echo $tableID;?>">
          <thead>
      <?php
        $count = 0;
        foreach ($sheetData as $columnName => $columnData) {

          echo "<tr>";
          foreach ($columnData  as $key => $value) {
                if ($count<count($columnData)) {
                  echo "<th>".$value."</th>\n";
                }else{
                  echo "<td>".$value."</td>\n";
                }
                $count++;
            }
            if($count==count($columnData)){
              echo "</thead><tbody>";
            }

            }
              echo "</tr>";
              $count++;
              echo "<br />\n";
              echo "</tbody></table>";
    }
    }

include 'footer.php';
    ?>
