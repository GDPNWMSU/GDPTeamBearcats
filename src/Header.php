<?php
/**
 * Header file.
 */

error_reporting(E_ALL);

?>
<html>
<head>
    <title>Reporter Parse Excel sheets</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <script src="./libraries/js/pace.js"></script>
    <style media="screen">
          .overlay{
      padding: 0px;
      margin: 0px;
      top: -10%;
      left: -10%;
      width: 150%;
      height: 150%;
      position: fixed;
      display: inline-block;
      background-color: #fff;
      z-index: 1032;
      }
    </style>
    <link rel="stylesheet" href="./libraries/css/pace.css"/>
    <link rel="stylesheet" href="./libraries/PhpSpreadsheet-develop/samples/bootstrap/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="./libraries/PhpSpreadsheet-develop/samples/bootstrap/css/font-awesome.min.css"/>
    <link rel="stylesheet" href="./libraries/PhpSpreadsheet-develop/samples/bootstrap/css/phpspreadsheet.css"/>
    <link rel="stylesheet" href="//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css"/>

    <script src="./libraries/PhpSpreadsheet-develop/samples/bootstrap/js/jquery.min.js"></script>
    <script src="//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
    <script src="./libraries/PhpSpreadsheet-develop/samples/bootstrap/js/bootstrap.min.js"></script>

</head>
<body style="padding-top:0px;">
  <div class="overlay"></div>
  <nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#"> Reporter</a>
    </div>

  </div><!-- /.container-fluid -->
</nav>
    <div class="container">
