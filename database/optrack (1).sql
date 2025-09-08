-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:4306
-- Generation Time: Sep 08, 2025 at 01:24 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `optrack`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `idAdmin` int(11) NOT NULL,
  `nmAdmin` varchar(255) DEFAULT NULL,
  `mobileAdmin` varchar(20) DEFAULT NULL,
  `emailAdmin` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`idAdmin`, `nmAdmin`, `mobileAdmin`, `emailAdmin`, `password`) VALUES
(2501001, 'admin', '089812793123', 'admin@gmail.com', '$2b$10$KQlrOsgplqMNPb5GZ8PKiOaqqgk/9XfEq2d/gJbtCE3ZEa4qqbH0q'),
(2501002, 'jef', '08902174', 'jef@gmail.com', '$2b$10$FyGC5L7QpbiKaLyGqupZX.eCR9ObY/loDrDNGL4vlZzAqJUknAlgq');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `idCustomer` int(11) NOT NULL,
  `nmCustomer` varchar(255) DEFAULT NULL,
  `mobileCustomer` varchar(20) DEFAULT NULL,
  `emailCustomer` varchar(255) DEFAULT NULL,
  `addrCustomer` text DEFAULT NULL,
  `corpCustomer` varchar(255) DEFAULT NULL,
  `idStatCustomer` int(11) DEFAULT NULL,
  `descCustomer` text DEFAULT NULL,
  `idSales` int(11) DEFAULT NULL,
  `tglInput` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`idCustomer`, `nmCustomer`, `mobileCustomer`, `emailCustomer`, `addrCustomer`, `corpCustomer`, `idStatCustomer`, `descCustomer`, `idSales`, `tglInput`) VALUES
(2505001, 'Cristiano Alvarez', '0897123912', 'Messi@gmail.com', 'Jl. Fatmawati No. 1 Lt 3', 'Pt. Barcelona', 1, 'Barcelona Laliga', 2503001, '2025-09-02 19:11:58');

-- --------------------------------------------------------

--
-- Table structure for table `expert`
--

CREATE TABLE `expert` (
  `idExpert` int(11) NOT NULL,
  `nmExpert` varchar(255) DEFAULT NULL,
  `mobileExpert` varchar(20) DEFAULT NULL,
  `emailExpert` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL COMMENT 'Hashed password for expert user',
  `idSkill` int(11) DEFAULT NULL,
  `statExpert` varchar(100) DEFAULT NULL,
  `Row` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expert`
--

INSERT INTO `expert` (`idExpert`, `nmExpert`, `mobileExpert`, `emailExpert`, `password`, `idSkill`, `statExpert`, `Row`) VALUES
(2504001, 'expert1', '081396187461', 'expert@gmail.com', '$2b$10$HYzGgqTmmxrCISASYQsP.ekUyoX9kGI8rSUbk0ecl6eFdzCD6KkGO', 2, 'ada', 'Expert 1'),
(2504002, 'Joko', '213452315', 'joko@gmail.com', '$2b$10$coO5pnUQZ299.rfHR8q4YeuC2vVThe2iQz0Y1EqYgTfCX1bRru3xm', 4, NULL, NULL),
(2504003, 'expert11', '089608728324', 'expert11@gmail.com', '$2b$10$VzIgvS.plhC9RReUMjHKXOLE5CffgHGPaJtEd4ulbCslwM8ZCy7Qu', 10, 'ada', 'qwq');

-- --------------------------------------------------------

--
-- Table structure for table `opti`
--

CREATE TABLE `opti` (
  `idOpti` int(11) NOT NULL,
  `nmOpti` varchar(255) DEFAULT NULL,
  `contactOpti` varchar(255) DEFAULT NULL,
  `mobileOpti` varchar(20) DEFAULT NULL,
  `emailOpti` varchar(255) DEFAULT NULL,
  `statOpti` varchar(100) DEFAULT NULL,
  `datePropOpti` date DEFAULT NULL,
  `idCustomer` int(11) DEFAULT NULL,
  `kebutuhan` text DEFAULT NULL,
  `idSumber` int(11) DEFAULT NULL,
  `idSales` int(11) NOT NULL,
  `jenisOpti` varchar(50) NOT NULL,
  `idExpert` int(11) DEFAULT NULL,
  `proposalOpti` varchar(255) DEFAULT NULL,
  `valOpti` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `opti`
--

INSERT INTO `opti` (`idOpti`, `nmOpti`, `contactOpti`, `mobileOpti`, `emailOpti`, `statOpti`, `datePropOpti`, `idCustomer`, `kebutuhan`, `idSumber`, `idSales`, `jenisOpti`, `idExpert`, `proposalOpti`, `valOpti`) VALUES
(2506001, 'Cara menjadi prabowo', 'Gibran', '089700000', 'munir@gmail.com', 'Just Get Info', '2025-09-02', 2505001, 'siop', 2, 2503001, 'Training', 2504002, '1756816474764.pdf', NULL),
(2506002, 'Cara menenangkan rakyat', 'Sahroni', '08125674321', 'sahroni@gmail.com', 'Just Get Info', '2025-09-23', 2505001, 'Cara menenangkan rakyat oleh sahroni tidak sampai menjarah rumah', 3, 2503001, 'Training', 2504002, '1756920899324.pdf', NULL),
(2506003, 'Penerapa SCRUM', 'Riski', '09875467964', 'riski@gmail.com', 'Success', '2025-10-02', 2505001, 'penerapan metode scrum untuk mahasiswa', 1, 2503001, 'Training', 2504002, '1756924763562.pdf', 10000000),
(2506004, 'Pemanfaatan sampah ', 'Juned', '08679834675', 'juned@gmail.com', 'Just Get Info', '2025-09-26', 2505001, 'Pemanfaatan sampah pada kehidupan sehari hari', 2, 2503001, 'Training', 2504002, '1756925243356.pdf', 2000000),
(2506005, 'project 1', 'samuel', '089977', 'samuel@gmail.com', 'Just Get Info', '2025-09-04', 2505001, 'project deskripsi', 1, 2503001, 'Project', 2504002, '1756955244858.pdf', 2000000000),
(2506006, 'project 2', 'samuel', '089977', 'samuel@gmail.com', 'Success', '2025-09-04', 2505001, 'project 2 deskripsi', 1, 2503001, 'Project', 2504002, '1756958635439.pdf', 5000000),
(2506007, 'project 3', 'samuel', '089977', 'samuel@gmail.com', 'Success', '2025-09-04', 2505001, 'project 3 deskripsi', 1, 2503001, 'Project', 2504002, '1756959801052.pdf', 6000000),
(2506008, 'training 1', 'adit', '08997766', 'adit@gmail.com', 'Success', '2025-09-04', 2505001, 'training 1', 3, 2503001, 'Training', 2504002, '1756959989587.pdf', 700000),
(2506009, 'Pelatihan C++', 'Rexxy', '085132145521', 'Rex@gmail.com', 'Success', '2025-09-08', 2505001, 'Pelatihan C++ selama 2 hari diharapkan dapat menguasai dasar dasar bahasa pemrograman C++', 1, 2503001, 'Training', 2504001, '1757320008441.pdf', 500000),
(2506010, 'Pelatihan C++', 'Greg', '087856421342', 'greg@gmail.com', 'Success', '2025-09-08', 2505001, 'pelatihan c++', 3, 2503001, 'Training', 2504001, NULL, 120000),
(2506011, 'Pelatihan Bahasa C', 'Celine', '085183123421', 'celine@gmail.com', 'Success', '2025-09-08', 2505001, 'Pelatihan 2 hari, target sudah bisa dasar dasar bahasa c', 3, 2503001, 'Training', 2504001, '1757323480989.pdf', 500000),
(2506012, 'Project Aplikasi Penjualan', 'Fahri', '085163721123', 'fahri@gmail.com', 'Success', '2025-09-08', 2505001, 'pembuatan aplikasi dengan deadline tanggal 11 September 2025', 2, 2503001, 'Project', 2504001, NULL, 700000),
(2506013, 'Pelatihan Web Dasar', 'Rahma', '7777777777', 'rahma@gmail.com', 'Success', '2025-09-08', 2505001, NULL, 2, 2503001, 'Training', 2504001, NULL, 12000000),
(2506014, 'Pelatihan Memasak', 'Juna', '6969696969', 'junjun@gmail.com', 'Success', '2025-09-08', 2505001, 'chef juna nih', 3, 2503001, 'Training', 2504001, NULL, 6000000),
(2506015, 'Pelatihan Trebel', 'MADRID', '1515151515', 'RM@gmail.com', 'Success', '2025-09-08', 2505001, NULL, 3, 2503001, 'Training', 2504001, NULL, 12345678),
(2506016, 'Pelatihan Menangis', 'ManUnited', '00000000000', 'MU@gmail.com', 'Success', '2025-09-08', 2505001, 'Pasti Tsunami Tropi', 3, 2503001, 'Training', 2504001, NULL, 2147483647);

-- --------------------------------------------------------

--
-- Table structure for table `outsource`
--

CREATE TABLE `outsource` (
  `idOutsource` int(11) NOT NULL,
  `nmOutsource` varchar(255) DEFAULT NULL,
  `qtyOutsource` int(11) DEFAULT NULL,
  `descOutsource` text DEFAULT NULL,
  `idSkill` int(11) DEFAULT NULL,
  `idCustomer` int(11) DEFAULT NULL,
  `idOpti` int(11) DEFAULT NULL,
  `startOutsource` datetime DEFAULT NULL,
  `endOutsource` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `idProject` int(11) NOT NULL,
  `nmProject` varchar(255) DEFAULT NULL,
  `idTypeProject` int(11) DEFAULT NULL,
  `startProject` datetime DEFAULT NULL,
  `endProject` datetime DEFAULT NULL,
  `idCustomer` int(11) DEFAULT NULL,
  `idOpti` int(11) DEFAULT NULL,
  `idSales` int(11) DEFAULT NULL,
  `idExpert` int(11) DEFAULT NULL,
  `placeProject` varchar(255) DEFAULT NULL,
  `statusProject` enum('Pending','On Progress','Finished') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`idProject`, `nmProject`, `idTypeProject`, `startProject`, `endProject`, `idCustomer`, `idOpti`, `idSales`, `idExpert`, `placeProject`, `statusProject`) VALUES
(2508001, 'project 1', 2, '2025-09-10 12:10:00', '2025-09-30 12:10:00', 2505001, 2506005, 2503001, 2504002, 'gedung a', 'Pending'),
(2508002, 'project 2', 4, '2025-09-10 12:00:00', '2025-09-12 12:00:00', 2505001, 2506006, 2503001, 2504002, 'rumah masing masing', 'Pending'),
(2508003, 'project 3', 2, '2025-09-10 11:22:00', '2025-11-30 11:22:00', 2505001, 2506007, 2503001, 2504002, 'gedung b', 'Pending'),
(2508004, 'Project Aplikasi Penjualan', 1, NULL, NULL, 2505001, 2506012, 2503001, 2504001, NULL, 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `idSales` int(11) NOT NULL,
  `nmSales` varchar(255) DEFAULT NULL,
  `mobileSales` varchar(20) DEFAULT NULL,
  `emailSales` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL COMMENT 'Hashed password for sales user',
  `descSales` text DEFAULT NULL,
  `role` enum('Sales','Head Sales') NOT NULL COMMENT 'Role of the user in sales team'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`idSales`, `nmSales`, `mobileSales`, `emailSales`, `password`, `descSales`, `role`) VALUES
(2502001, 'Head of Sales', '0812736183', 'hof@gmail.com', '$2b$10$ffOrRnvb4hfSNrVw1pcBbu.b.uBtEJUU/PV9OfezxZB9Z3Y/dbHzu', 'Head Sales 1', 'Head Sales'),
(2503001, 'sales', '09182183129', 'sales@gmail.com', '$2b$10$OoYVuSAqyovNm.NLiFlvxetFsm.e/Nv9J.FAas8alhtLhdvYZeOl.', 'sales 1', 'Sales'),
(2503002, 'Sales2', '218397219', 'sales2@gmail.com', '$2b$10$eq1jm5JWGBnOXcP29y8Ow.YUR3Uk4s2TtKXKmsuSmYj7yTA3PLmGq', 'dsfsddcdsaf', 'Sales');

-- --------------------------------------------------------

--
-- Table structure for table `skill`
--

CREATE TABLE `skill` (
  `idSkill` int(11) NOT NULL,
  `nmSkill` varchar(255) DEFAULT NULL,
  `statSkill` varchar(100) DEFAULT NULL,
  `descSkill` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skill`
--

INSERT INTO `skill` (`idSkill`, `nmSkill`, `statSkill`, `descSkill`) VALUES
(1, 'JavaScript Development', 'Active', 'Keahlian dalam pengembangan aplikasi menggunakan JavaScript, termasuk ES6+.'),
(2, 'React.js Frontend', 'Active', 'Pengembangan antarmuka pengguna (UI) modern dan interaktif menggunakan React.js.'),
(3, 'Node.js & Express.js Backend', 'Active', 'Membangun sisi server (backend) dan API menggunakan Node.js dan Express.js.'),
(4, 'Database MySQL', 'Active', 'Manajemen dan desain database relasional menggunakan MySQL.'),
(5, 'Project Management (Agile/Scrum)', 'Active', 'Keahlian dalam mengelola proyek perangkat lunak menggunakan metodologi Agile dan Scrum.'),
(6, 'Cloud Computing (AWS)', 'Active', 'Implementasi dan manajemen infrastruktur pada platform Amazon Web Services.'),
(7, 'UI/UX Design', 'Active', 'Desain antarmuka dan pengalaman pengguna yang intuitif dan menarik.'),
(8, 'Python for Data Science', 'Active', 'Analisis data dan machine learning menggunakan bahasa pemrograman Python.'),
(9, 'Public Speaking & Presentation', 'Active', 'Kemampuan menyampaikan materi secara efektif di depan audiens.'),
(10, 'Leadership & Team Management', 'Active', 'Keahlian dalam memimpin dan mengelola tim untuk mencapai tujuan proyek.');

-- --------------------------------------------------------

--
-- Table structure for table `statcustomer`
--

CREATE TABLE `statcustomer` (
  `idStatCustomer` int(11) NOT NULL,
  `nmStatCustomer` varchar(255) DEFAULT NULL,
  `descStatCustomer` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `statcustomer`
--

INSERT INTO `statcustomer` (`idStatCustomer`, `nmStatCustomer`, `descStatCustomer`) VALUES
(1, 'Review', 'Pending Customers (Review)'),
(2, 'Approved', 'Confirmed customer'),
(3, 'Reject', 'Rejecting Customers');

-- --------------------------------------------------------

--
-- Table structure for table `sumber`
--

CREATE TABLE `sumber` (
  `idSumber` int(11) NOT NULL,
  `nmSumber` varchar(255) DEFAULT NULL,
  `descSumber` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sumber`
--

INSERT INTO `sumber` (`idSumber`, `nmSumber`, `descSumber`) VALUES
(1, 'Website', 'Lead from company website'),
(2, 'Referral', 'Lead from customer referral'),
(3, 'Event', 'Lead from event or exhibition');

-- --------------------------------------------------------

--
-- Table structure for table `training`
--

CREATE TABLE `training` (
  `idTraining` int(11) NOT NULL,
  `nmTraining` varchar(255) DEFAULT NULL,
  `idTypeTraining` int(11) DEFAULT NULL,
  `startTraining` datetime DEFAULT NULL,
  `endTraining` datetime DEFAULT NULL,
  `idExpert` int(11) DEFAULT NULL,
  `placeTraining` varchar(255) DEFAULT NULL,
  `examTraining` varchar(255) DEFAULT NULL,
  `examDateTraining` date DEFAULT NULL,
  `idCustomer` int(11) DEFAULT NULL,
  `idOpti` int(11) DEFAULT NULL,
  `statusTraining` enum('Pending','On Progress','Finished') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `training`
--

INSERT INTO `training` (`idTraining`, `nmTraining`, `idTypeTraining`, `startTraining`, `endTraining`, `idExpert`, `placeTraining`, `examTraining`, `examDateTraining`, `idCustomer`, `idOpti`, `statusTraining`) VALUES
(2507003, 'Penerapa SCRUM', 4, '2025-10-01 18:38:00', '2025-10-09 18:39:00', 2504002, 'Gedung FEB', '0', NULL, 2505001, 2506003, 'Pending'),
(2507004, 'Pemanfaatan sampah ', 2, '2025-09-25 18:46:00', '2025-09-29 18:46:00', 2504002, 'Istana Negara', '0', NULL, 2505001, 2506004, 'Pending'),
(2507005, 'training 1', 2, '2025-09-04 17:30:00', '2026-01-31 12:30:00', 2504002, 'gedung c', NULL, NULL, 2505001, 2506008, 'On Progress'),
(2507006, 'Pelatihan Bahasa C', 4, '2025-09-08 16:24:00', '2025-09-10 16:24:00', 2504001, 'Google Meet', NULL, NULL, 2505001, 2506011, 'On Progress'),
(2507007, 'Pelatihan Web Dasar', 4, '2025-09-08 17:41:00', '2025-09-08 17:42:00', 2504001, 'Kos Aqip', NULL, NULL, 2505001, 2506013, 'Finished'),
(2507008, 'Pelatihan Memasak', 2, '2025-09-08 17:52:00', '2025-09-08 17:53:00', 2504001, 'Kos Aqip', NULL, NULL, 2505001, 2506014, 'Finished'),
(2507009, 'Pelatihan Trebel', 2, '2025-09-08 17:56:00', '2025-09-08 17:57:00', 2504001, 'Jakarta International Stadium', NULL, NULL, 2505001, 2506015, 'Finished'),
(2507010, 'Pelatihan Menangis', 3, '2025-09-08 18:22:00', '2025-09-08 18:23:00', 2504001, 'Santiago Bernabue', NULL, NULL, 2505001, 2506016, 'Finished');

-- --------------------------------------------------------

--
-- Table structure for table `typeproject`
--

CREATE TABLE `typeproject` (
  `idTypeProject` int(11) NOT NULL,
  `nmTypeProject` varchar(255) DEFAULT NULL,
  `statTypeProject` varchar(100) DEFAULT NULL,
  `descTypeProject` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `typeproject`
--

INSERT INTO `typeproject` (`idTypeProject`, `nmTypeProject`, `statTypeProject`, `descTypeProject`) VALUES
(1, 'Default Project', NULL, NULL),
(2, 'Public Project', NULL, NULL),
(3, 'Inhouse Project', NULL, NULL),
(4, 'Online Project', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `typetraining`
--

CREATE TABLE `typetraining` (
  `idTypeTraining` int(11) NOT NULL,
  `nmTypeTraining` varchar(255) DEFAULT NULL,
  `statTypeTraining` varchar(100) DEFAULT NULL,
  `descTypeTraining` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `typetraining`
--

INSERT INTO `typetraining` (`idTypeTraining`, `nmTypeTraining`, `statTypeTraining`, `descTypeTraining`) VALUES
(1, 'Default Training', NULL, NULL),
(2, 'Public Training', NULL, NULL),
(3, 'Inhouse Training', NULL, NULL),
(4, 'Online Training', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`idAdmin`),
  ADD UNIQUE KEY `emailAdmin` (`emailAdmin`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`idCustomer`),
  ADD KEY `idStatCustomer` (`idStatCustomer`),
  ADD KEY `idSales` (`idSales`);

--
-- Indexes for table `expert`
--
ALTER TABLE `expert`
  ADD PRIMARY KEY (`idExpert`),
  ADD KEY `idSkill` (`idSkill`);

--
-- Indexes for table `opti`
--
ALTER TABLE `opti`
  ADD PRIMARY KEY (`idOpti`),
  ADD KEY `idCustomer` (`idCustomer`),
  ADD KEY `idSumber` (`idSumber`),
  ADD KEY `idSales` (`idSales`),
  ADD KEY `idExpert` (`idExpert`);

--
-- Indexes for table `outsource`
--
ALTER TABLE `outsource`
  ADD PRIMARY KEY (`idOutsource`),
  ADD KEY `idSkill` (`idSkill`),
  ADD KEY `idCustomer` (`idCustomer`),
  ADD KEY `fk_outsource_opti_idx` (`idOpti`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`idProject`),
  ADD KEY `idCustomer` (`idCustomer`),
  ADD KEY `idSales` (`idSales`),
  ADD KEY `idExpert` (`idExpert`),
  ADD KEY `fk_project_opti_idx` (`idOpti`),
  ADD KEY `fk_project_type` (`idTypeProject`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`idSales`);

--
-- Indexes for table `skill`
--
ALTER TABLE `skill`
  ADD PRIMARY KEY (`idSkill`);

--
-- Indexes for table `statcustomer`
--
ALTER TABLE `statcustomer`
  ADD PRIMARY KEY (`idStatCustomer`);

--
-- Indexes for table `sumber`
--
ALTER TABLE `sumber`
  ADD PRIMARY KEY (`idSumber`);

--
-- Indexes for table `training`
--
ALTER TABLE `training`
  ADD PRIMARY KEY (`idTraining`),
  ADD KEY `idTypeTraining` (`idTypeTraining`),
  ADD KEY `idExpert` (`idExpert`),
  ADD KEY `idCustomer` (`idCustomer`),
  ADD KEY `fk_training_opti_idx` (`idOpti`);

--
-- Indexes for table `typeproject`
--
ALTER TABLE `typeproject`
  ADD PRIMARY KEY (`idTypeProject`);

--
-- Indexes for table `typetraining`
--
ALTER TABLE `typetraining`
  ADD PRIMARY KEY (`idTypeTraining`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `idAdmin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2501003;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `idCustomer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2505002;

--
-- AUTO_INCREMENT for table `expert`
--
ALTER TABLE `expert`
  MODIFY `idExpert` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2504004;

--
-- AUTO_INCREMENT for table `opti`
--
ALTER TABLE `opti`
  MODIFY `idOpti` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2506017;

--
-- AUTO_INCREMENT for table `outsource`
--
ALTER TABLE `outsource`
  MODIFY `idOutsource` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `idProject` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2508005;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `idSales` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2503003;

--
-- AUTO_INCREMENT for table `skill`
--
ALTER TABLE `skill`
  MODIFY `idSkill` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `statcustomer`
--
ALTER TABLE `statcustomer`
  MODIFY `idStatCustomer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sumber`
--
ALTER TABLE `sumber`
  MODIFY `idSumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `training`
--
ALTER TABLE `training`
  MODIFY `idTraining` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2507011;

--
-- AUTO_INCREMENT for table `typeproject`
--
ALTER TABLE `typeproject`
  MODIFY `idTypeProject` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `typetraining`
--
ALTER TABLE `typetraining`
  MODIFY `idTypeTraining` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`idStatCustomer`) REFERENCES `statcustomer` (`idStatCustomer`),
  ADD CONSTRAINT `customer_ibfk_2` FOREIGN KEY (`idSales`) REFERENCES `sales` (`idSales`);

--
-- Constraints for table `expert`
--
ALTER TABLE `expert`
  ADD CONSTRAINT `expert_ibfk_1` FOREIGN KEY (`idSkill`) REFERENCES `skill` (`idSkill`);

--
-- Constraints for table `opti`
--
ALTER TABLE `opti`
  ADD CONSTRAINT `opti_ibfk_1` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`),
  ADD CONSTRAINT `opti_ibfk_2` FOREIGN KEY (`idSumber`) REFERENCES `sumber` (`idSumber`),
  ADD CONSTRAINT `opti_ibfk_3` FOREIGN KEY (`idSales`) REFERENCES `sales` (`idSales`),
  ADD CONSTRAINT `opti_ibfk_4` FOREIGN KEY (`idExpert`) REFERENCES `expert` (`idExpert`);

--
-- Constraints for table `outsource`
--
ALTER TABLE `outsource`
  ADD CONSTRAINT `fk_outsource_opti` FOREIGN KEY (`idOpti`) REFERENCES `opti` (`idOpti`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `outsource_ibfk_1` FOREIGN KEY (`idSkill`) REFERENCES `skill` (`idSkill`),
  ADD CONSTRAINT `outsource_ibfk_2` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`);

--
-- Constraints for table `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `fk_project_opti` FOREIGN KEY (`idOpti`) REFERENCES `opti` (`idOpti`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_project_type` FOREIGN KEY (`idTypeProject`) REFERENCES `typeproject` (`idTypeProject`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `project_ibfk_1` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`),
  ADD CONSTRAINT `project_ibfk_2` FOREIGN KEY (`idSales`) REFERENCES `sales` (`idSales`),
  ADD CONSTRAINT `project_ibfk_3` FOREIGN KEY (`idExpert`) REFERENCES `expert` (`idExpert`);

--
-- Constraints for table `training`
--
ALTER TABLE `training`
  ADD CONSTRAINT `fk_training_opti` FOREIGN KEY (`idOpti`) REFERENCES `opti` (`idOpti`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `training_ibfk_1` FOREIGN KEY (`idTypeTraining`) REFERENCES `typetraining` (`idTypeTraining`),
  ADD CONSTRAINT `training_ibfk_2` FOREIGN KEY (`idExpert`) REFERENCES `expert` (`idExpert`),
  ADD CONSTRAINT `training_ibfk_3` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
