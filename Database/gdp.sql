-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 27, 2018 at 09:15 PM
-- Server version: 10.1.30-MariaDB
-- PHP Version: 7.2.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gdp`
--

-- --------------------------------------------------------

--
-- Table structure for table `imported_files`
--

CREATE TABLE `imported_files` (
  `ID` int(11) NOT NULL,
  `FILE_NAME` varchar(50) NOT NULL,
  `FILE_PATH` varchar(100) DEFAULT NULL,
  `FILE_TYPE` varchar(10) NOT NULL,
  `LOCAL_FILENAME` varchar(100) NOT NULL,
  `TIMESTAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `FILE_BLOB` longblob
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `imported_files`
--

INSERT INTO `imported_files` (`ID`, `FILE_NAME`, `FILE_PATH`, `FILE_TYPE`, `LOCAL_FILENAME`, `TIMESTAMP`, `FILE_BLOB`) VALUES
(1, 'test.xlsx', './imported_Files/', '.xlsx', '', '2018-06-27 19:07:30', NULL),
(2, 'example2.xls', './imported_Files/', '.xls', '', '2018-06-27 19:09:18', NULL),
(3, 'test.xlsx', './imported_Files/', '.xlsx', '', '2018-06-27 19:12:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mime_file_types`
--

CREATE TABLE `mime_file_types` (
  `FILE_TYPE` varchar(10) NOT NULL,
  `MIME` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mime_file_types`
--

INSERT INTO `mime_file_types` (`FILE_TYPE`, `MIME`) VALUES
('oc', 'application/msword'),
('.dot', 'application/msword'),
('.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
('.dotx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.template'),
('.docm', 'application/vnd.ms-word.document.macroEnabled.12'),
('.dotm', 'application/vnd.ms-word.template.macroEnabled.12'),
('.xls', 'application/vnd.ms-excel'),
('.xlt', 'application/vnd.ms-excel'),
('.xla', 'application/vnd.ms-excel'),
('.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
('.xltx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.template'),
('.xlsm', 'application/vnd.ms-excel.sheet.macroEnabled.12'),
('.xltm', 'application/vnd.ms-excel.template.macroEnabled.12'),
('.xlam', 'application/vnd.ms-excel.addin.macroEnabled.12'),
('.xlsb', 'application/vnd.ms-excel.sheet.binary.macroEnabled.12'),
('.ppt', 'application/vnd.ms-powerpoint'),
('.pot', 'application/vnd.ms-powerpoint'),
('.pps', 'application/vnd.ms-powerpoint'),
('.ppa', 'application/vnd.ms-powerpoint'),
('.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'),
('.potx', 'application/vnd.openxmlformats-officedocument.presentationml.template'),
('.ppsx', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'),
('.ppam', 'application/vnd.ms-powerpoint.addin.macroEnabled.12'),
('.pptm', 'application/vnd.ms-powerpoint.presentation.macroEnabled.12'),
('.potm', 'application/vnd.ms-powerpoint.template.macroEnabled.12'),
('.ppsm', 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'),
('.mdb', 'application/vnd.ms-access');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `imported_files`
--
ALTER TABLE `imported_files`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `imported_files`
--
ALTER TABLE `imported_files`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
