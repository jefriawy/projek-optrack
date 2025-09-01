-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 01, 2025 at 09:33 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.3.14

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
(2, 'admin', '081421490', 'admin@gmail.com', '$2b$10$yMH/Ipej.vG1plrcMH66zeexWPa23.Lv2MLSCReJJya18cjt0kHYi'),
(2501001, 'admin1', '089812793123', 'admin1@gmail.com', '$2b$10$KQlrOsgplqMNPb5GZ8PKiOaqqgk/9XfEq2d/gJbtCE3ZEa4qqbH0q');

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
(1, 'Linda', '0812123314', 'lin@gmail.com', 'Jl.Kedaung', 'MamaSuka', 1, 'Perusahaan Makanan', 2503001, '2025-08-28 22:00:21'),
(2, 'Jefri', '080808080', 'jef@gmail.com', 'Jlaan Jefri bahagia', 'Jefrigusgus', 1, 'saukjxhsakj', 2503001, '2025-08-29 18:46:36'),
(3, 'Rusdi', '089090192', 'Rus@gmail.com', 'Jalan Rush', 'MamaSuka', 1, 'Jukisab', 2503001, '2025-08-29 18:47:40'),
(4, 'Rendy', '9089089', 'Ren@gmail.com', 'Jalan Bahagia2', 'RenRenDuck', 1, 'hjbhjgbxs', 2503002, '2025-08-29 18:59:37'),
(5, 'Agus', '2137982179', 'gus@gmail.com', 'jalan Jalan jalan', 'GusAway', 1, 'nsdlknclk', 2503002, '2025-08-29 19:00:13');

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
(2504001, 'expert', '081396187461', 'expert@gmail.com', '$2b$10$HYzGgqTmmxrCISASYQsP.ekUyoX9kGI8rSUbk0ecl6eFdzCD6KkGO', 2, 'ada', 'Expert 1'),
(2504002, 'Joko', '213452315', 'joko@gmail.com', '$2b$10$coO5pnUQZ299.rfHR8q4YeuC2vVThe2iQz0Y1EqYgTfCX1bRru3xm', 4, NULL, NULL);

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
  `propOpti` varchar(255) DEFAULT NULL,
  `datePropOpti` date DEFAULT NULL,
  `idCustomer` int(11) DEFAULT NULL,
  `kebutuhan` text DEFAULT NULL,
  `idSumber` int(11) DEFAULT NULL,
  `idSales` int(11) NOT NULL,
  `jenisOpti` varchar(50) NOT NULL,
  `idExpert` int(11) DEFAULT NULL,
  `proposalOpti` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `opti`
--

INSERT INTO `opti` (`idOpti`, `nmOpti`, `contactOpti`, `mobileOpti`, `emailOpti`, `statOpti`, `propOpti`, `datePropOpti`, `idCustomer`, `kebutuhan`, `idSumber`, `idSales`, `jenisOpti`, `idExpert`, `proposalOpti`) VALUES
(2, 'Pelatihan Web Dasar', 'Rahma', '08124521231', 'rahma@gmail.com', 'Just Get Info', NULL, '2025-08-28', 1, 'xsax', 1, 2503001, 'Training', NULL, NULL),
(3, 'Pelatihan Satpam', 'diana', '0876271823', 'diana@gmail.com', 'Just Get Info', NULL, '2025-08-28', 1, 'sadaxsaxads', 1, 2503001, 'Training', 2504001, NULL),
(4, 'Pelatihan Satpam', 'diana', '0876271823', 'diana@gmail.com', 'Just Get Info', NULL, '2025-08-28', 1, 'sadaxsaxads', 1, 2503001, 'Training', 2504001, NULL),
(5, 'Potong Rambut', 'Munir', '085817165543', 'munir@gmail.com', 'Just Get Info', NULL, '2025-08-28', 1, '', 1, 2503001, 'Training', 2504001, NULL),
(6, 'Pelatihan Satpamsaxsax', 'Barber', '9098769021', 'barber@gmail.com', 'Just Get Info', '', '2025-08-28', 1, 'sasad', 1, 2503001, 'Training', 2504001, 'C:\\Magang\\cp3\\projek-optrack\\backend\\uploads\\proposals\\1756404858468.pdf'),
(7, 'Project Masa depan', 'Julian', '9890890908', 'Juli@gmail.com', 'Just Get Info', NULL, '2025-08-29', 2, 'gbkjsabxkjsanx', 1, 2503001, 'Training', 2504002, NULL),
(8, 'Web Maju', 'Hasan', '9080890809', 'Has@gmail.com', 'Just Get Info', NULL, '2025-08-29', 2, 'khsakjdh', 1, 2503001, 'Training', 2504002, 'C:\\Magang\\cp3\\projek-optrack\\backend\\uploads\\proposals\\1756468383813.pdf'),
(9, 'Halusinasi', 'Jeki', '907756477', 'Jke@gmail.com', 'Just Get Info', NULL, '2025-08-29', 4, 'dfzgvdsfvdv', 1, 2503002, 'Training', 2504001, NULL),
(10, 'Pelatihan angkat beban', 'Agung', '0899887766', 'Agung@gmail.com', 'Just Get Info', NULL, '2025-08-30', 3, 'angkat beban', 1, 2503001, 'Training', 2504002, 'C:\\Users\\USER\\OneDrive\\Dokumen\\Tugas Kuliah\\magang\\progress optrack\\part4\\projek-optrack\\backend\\uploads\\proposals\\1756557376110.pdf'),
(2506001, 'pelatihan tembak', 'prabo', '089988776655', 'prabo@gmail.com', 'Just Get Info', NULL, '2025-08-30', 3, 'tembak tembak', 1, 2503001, 'Training', 2504002, '1756567514715.pdf'),
(2506002, 'pelatihan basket', 'jordan', '08982737', 'jordan@gmail.com', 'Just Get Info', NULL, '2025-09-01', 3, 'basket', 3, 2503001, 'Training', NULL, '1756705994959.pdf');

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
  `startProject` date DEFAULT NULL,
  `endProject` date DEFAULT NULL,
  `idCustomer` int(11) DEFAULT NULL,
  `idOpti` int(11) DEFAULT NULL,
  `idSales` int(11) DEFAULT NULL,
  `idExpert` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proposal`
--

CREATE TABLE `proposal` (
  `idProposal` int(11) NOT NULL,
  `nmProposal` varchar(255) DEFAULT NULL,
  `descProposal` text DEFAULT NULL,
  `sendDateProposal` date DEFAULT NULL,
  `idCustomer` int(11) DEFAULT NULL,
  `picProposal` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `idOpti` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `training`
--

INSERT INTO `training` (`idTraining`, `nmTraining`, `idTypeTraining`, `startTraining`, `endTraining`, `idExpert`, `placeTraining`, `examTraining`, `examDateTraining`, `idCustomer`, `idOpti`) VALUES
(3, 'Potong Rambut', 1, '2025-08-29 00:00:00', '2025-10-29 00:00:00', 2504001, 'Jakarta International Stadium', '0', NULL, 1, NULL),
(4, 'Pelatihan Satpam', 2, '2025-08-29 00:00:00', '2025-11-29 00:00:00', 2504001, 'Jakarta International Stadium', '0', NULL, 1, NULL),
(5, 'Project Masa depan', 2, '2025-08-29 00:00:00', '2025-11-28 00:00:00', 2504002, 'JIZ', '0', NULL, 2, NULL),
(6, 'Web Maju', 4, '2025-08-29 00:00:00', '2025-12-26 00:00:00', 2504002, 'Surabaya', '0', NULL, 2, NULL),
(7, 'Halusinasi', 2, '2025-08-29 00:00:00', '2025-09-15 00:00:00', 2504001, 'PUBG Landmark', '0', NULL, 4, NULL),
(8, 'Pelatihan angkat beban', 2, '2025-09-10 00:00:00', '2025-11-30 00:00:00', 2504002, 'GYM', '0', NULL, 3, NULL),
(2507002, 'pelatihan tembak', 2, '2025-08-31 13:00:00', '2025-10-30 13:00:00', 2504002, 'lapangan tembak', '0', NULL, 3, NULL),
(2507003, 'pelatihan basket', 2, '2025-09-02 13:00:00', '2025-12-31 13:00:00', NULL, 'lapangan', '0', NULL, 3, 2506002);

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
  ADD KEY `fk_project_opti_idx` (`idOpti`);

--
-- Indexes for table `proposal`
--
ALTER TABLE `proposal`
  ADD PRIMARY KEY (`idProposal`),
  ADD KEY `idCustomer` (`idCustomer`);

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
  MODIFY `idAdmin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2501002;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `idCustomer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `expert`
--
ALTER TABLE `expert`
  MODIFY `idExpert` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2504003;

--
-- AUTO_INCREMENT for table `opti`
--
ALTER TABLE `opti`
  MODIFY `idOpti` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2506003;

--
-- AUTO_INCREMENT for table `outsource`
--
ALTER TABLE `outsource`
  MODIFY `idOutsource` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `idProject` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `proposal`
--
ALTER TABLE `proposal`
  MODIFY `idProposal` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `idTraining` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2507004;

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
  ADD CONSTRAINT `project_ibfk_1` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`),
  ADD CONSTRAINT `project_ibfk_2` FOREIGN KEY (`idSales`) REFERENCES `sales` (`idSales`),
  ADD CONSTRAINT `project_ibfk_3` FOREIGN KEY (`idExpert`) REFERENCES `expert` (`idExpert`);

--
-- Constraints for table `proposal`
--
ALTER TABLE `proposal`
  ADD CONSTRAINT `proposal_ibfk_1` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`);

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
