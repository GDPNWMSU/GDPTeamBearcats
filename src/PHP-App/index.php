<?php
include 'Header.php';
 ?>

<h2>Import Excel report </h2>
  <div class="col-md-offset-3 col-md-5">
    <div class="jumbotron">
<form action="file_importer.php" class="form-inline" method="post" enctype="multipart/form-data">
<label for="file" class="form-label">Filename:</label>
<input type="file" name="Filename" id="Filename"><br>
<input type="submit" class="btn btn-success btn-block" name="submit" value="Submit">
</form>
</div>
</div>
<?php
include 'footer.php';
 ?>
