<?php
/* Contribution
  Day 1: Parsed Excel sheet using getSheetByName() method.
  Day 2: Displayed parsed excel data into tables and also included bootstrap for styling.
  Day 3: Add DataTable to parsed excel tables and also added pace pre-loader.
  Day 4: Add code to navigate or parse previously uploaded files
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
$imported_files_list = $helper->getAllImportedFileList();
?>
<div class="row">
  <div class="col-md-6">
<label>Select from imported files</label>:
  <select id="fileSelect">
    <option value="0">Select previous files</option>
<?php
foreach ($imported_files_list as $imported_file_name) {
?>
    <option value="<?php echo $imported_file_name[0].'">'.$imported_file_name[1];?></option>
<?php
}
?>
</select>
</div>
<div class="col-md-2"><strong>(or)</strong></div>
<div class="col-md-4">
<?php
if (isset($_GET['file'])) {
  $file_details = $helper -> getImportedFileByID($_GET['file']);
}else{
$file_details = $helper->getLastImportedFile();
}
if(count($file_details)>1){
$inputFileType = ucwords(substr($file_details[0],1));
$inputFileName = $file_details[1].$file_details[2];

$reader = IOFactory::createReader($inputFileType);
$reader->setReadDataOnly(true);
$spreadsheet = $reader->load($inputFileName);
$sheetCount = $spreadsheet->getSheetCount();
$sheetNames = $spreadsheet->getSheetNames();
?>
<a href="./" class="btn btn-primary">Upload another file</a>
</div>
</div>
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
