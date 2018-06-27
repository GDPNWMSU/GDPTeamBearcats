<?php

require 'libraries/PhpSpreadsheet-develop/vendor/autoload.php';
// require 'libraries/PhpSpreadsheet-develop/samples/Header.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

// $spreadsheet = new Spreadsheet();
// $sheet = $spreadsheet->getActiveSheet();
// $sheet->setCellValue('A1', 'Hello World !');

// $writer = new Xlsx($spreadsheet);
// if ($writer->save('hello world.xlsx')) {
// echo "success";
// };

use PhpOffice\PhpSpreadsheet\Helper\Sample;
use PhpOffice\PhpSpreadsheet\IOFactory;

// require __DIR__ . '/../Header.php';

$inputFileType = 'Xls';
// $inputFileName = __DIR__ . '/sampleData/example2.xls';
$inputFileName = 'libraries/PhpSpreadsheet-develop/samples/Reader/sampleData/example1.xls';

// Create a new Reader of the type defined in $inputFileType
$reader = IOFactory::createReader($inputFileType);
// Load $inputFileName to a PhpSpreadsheet Object
$spreadsheet = $reader->load($inputFileName);

// Use the PhpSpreadsheet object's getSheetCount() method to get a count of the number of WorkSheets in the WorkBook
$sheetCount = $spreadsheet->getSheetCount();
// $helper->log('There ' . (($sheetCount == 1) ? 'is' : 'are') . ' ' . $sheetCount . ' WorkSheet' . (($sheetCount == 1) ? '' : 's') . ' in the WorkBook');
echo 'There ' . (($sheetCount == 1) ? 'is' : 'are') . ' ' . $sheetCount . ' WorkSheet' . (($sheetCount == 1) ? '' : 's') . ' in the WorkBook';
echo "<br />\n";
// $helper->log('Reading the names of Worksheets in the WorkBook');
// Use the PhpSpreadsheet object's getSheetNames() method to get an array listing the names/titles of the WorkSheets in the WorkBook
$sheetNames = $spreadsheet->getSheetNames();
foreach ($sheetNames as $sheetIndex => $sheetName) {
    // $helper->log('WorkSheet #' . $sheetIndex . ' is named "' . $sheetName . '"');
    echo "<br />\n";
    echo 'WorkSheet #' . $sheetIndex . ' is named "' . $sheetName . '"';
    echo "<br />\n";
    $sheetData = $spreadsheet->getSheetByName($sheetName)->toArray(null, true, true, true);
    var_dump($sheetData);
}
