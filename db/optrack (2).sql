-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 28, 2025 at 11:47 AM
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
(39, 'anton', '08999222', 'anton@gmail.com', 'jl mangga', 'PT gg', 2, 'aasdawsdwa', 2, '2025-08-08 22:17:24'),
(40, 'joni', '08992375', 'joni@gmail.com', 'jl mangga', 'PT gg', 2, 'sadwasd', 2, '2025-08-08 22:17:24'),
(41, 'Bayu', '123456789', 'Bayu@gmail.com', 'DDN II no 15', 'Tsaqip', 2, 'orang ini ganteng banget', 2, '2025-08-08 22:17:24'),
(42, 'sad', '21321321321', 'Baywwwu@gmail.com', 'sadsadsac', 'sadsadqw', 1, 'sacxz', 2, '2025-08-08 22:41:04'),
(43, 'ren', '2132132134', 'bas@gmail.com', 'sadsafsac', 'scsadg', 2, 'sacdsgfawerg', 3, '2025-08-08 23:00:24'),
(44, 'contoh', '086571324', 'asdsa@gmail.com', 'sadscdsafsadgdf', 'contoh', 2, 'sacsdag', 2, '2025-08-08 23:15:25'),
(45, 'jeki', '08637146212', 'jeki@gmail.com', 'jalan jalan', 'jekisgroup', 2, 'jekijeki', 2, '2025-08-08 23:16:16'),
(46, 'RENDY', '03213124123', 'denzell@gmail.com', 'Pasar minggu base', 'PT Rendy', 1, 'Deskripsi....', 5, '2025-08-19 19:24:27');

-- --------------------------------------------------------

--
-- Table structure for table `expert`
--

CREATE TABLE `expert` (
  `idExpert` int(11) NOT NULL,
  `nmExpert` varchar(255) DEFAULT NULL,
  `mobileExpert` varchar(20) DEFAULT NULL,
  `emailExpert` varchar(255) DEFAULT NULL,
  `idSkill` int(11) DEFAULT NULL,
  `statExpert` varchar(100) DEFAULT NULL,
  `Row` text DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expert`
--

INSERT INTO `expert` (`idExpert`, `nmExpert`, `mobileExpert`, `emailExpert`, `idSkill`, `statExpert`, `Row`, `userId`) VALUES
(3, 'aqip', '08123456789', 'aqip@gmail.com', 2, 'aktif', 'expert', 2504001);

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
  `namaExpert` varchar(255) NOT NULL,
  `proposalOpti` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `opti`
--

INSERT INTO `opti` (`idOpti`, `nmOpti`, `contactOpti`, `mobileOpti`, `emailOpti`, `statOpti`, `propOpti`, `datePropOpti`, `idCustomer`, `kebutuhan`, `idSumber`, `idSales`, `jenisOpti`, `namaExpert`, `proposalOpti`) VALUES
(14, 'Opti Anton', 'Anton', '09748674567', 'anton@gmail.com', 'On-Progress', '7536735', '2025-08-20', 39, 'sfdfsadfdsa', 1, 2, '', '', NULL),
(15, 'OPTI rendy', 'Rendy', '03123123123', 'denzell@gmail.com', 'On-Progress', '0312124', '2025-08-21', 46, 'sadasdasd', 2, 5, '', '', NULL),
(16, 'OPTI Bayu', 'Bayu', '08797598', 'bayu@gmail.com', 'Follow Up', '6456253425', '2025-08-21', 41, 'dasdasdwqdfq', 3, 2, '', '', NULL),
(17, 'OPTI Jef', 'Jefri', '08412423', 'jef@gmail.com', 'Failed', '2315433', '2025-08-20', 44, 'dasdefwefwef', 1, 2, '', '', NULL),
(18, 'OPTI JEK', 'Jeki', '08797598', 'reasdn@gmail.com', 'Just Get Info', '42134123', '2025-08-21', 45, 'hergerg', 1, 2, '', '', NULL);

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
  `idCustomer` int(11) DEFAULT NULL
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
  `descSales` text DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`idSales`, `nmSales`, `mobileSales`, `emailSales`, `descSales`, `userId`) VALUES
(2, 'andi', '08123456789', 'andi@gmail.com', NULL, 5),
(3, 'jono', NULL, 'jono@gmail.com', NULL, 8),
(5, 'Sales', '08970087234', 'sales@gmail.com', 'Sales1', 11),
(8, 'Head of Sales', NULL, 'hof@gmail.com', NULL, 2502001),
(9, 'adit', '0812345', 'adit@gmail.com', 'asdwa', 2503001);

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
  `startTraining` date DEFAULT NULL,
  `endTraining` date DEFAULT NULL,
  `idExpert` int(11) DEFAULT NULL,
  `placeTraining` varchar(255) DEFAULT NULL,
  `examTraining` varchar(255) DEFAULT NULL,
  `examDateTraining` date DEFAULT NULL,
  `idCustomer` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Sales','Admin','Expert','Head Sales') NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mobile` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`, `mobile`) VALUES
(5, 'andi', 'andi@gmail.com', '$2a$12$RwCNVfXuE9k/iO36J3Fyre3iDaNa8OIXYjdupnEV/2xZRHyikikPq', 'Sales', '2025-08-08 08:07:22', '2025-08-08 08:07:22', NULL),
(8, 'jono', 'jono@gmail.com', '$2b$10$ksrsmmmRQW7cpGHnLHeTQOWuKH6Isqn87YVFIQXp6J1U1TJEjNynK', 'Sales', '2025-08-08 08:51:58', '2025-08-08 08:51:58', NULL),
(10, 'admin', 'admin@gmail.com', '$2b$10$Q.oUpq8wOh4B1gllpbJn1.nkVin/pZ9aI1Cbh/R2WZhfVI7laYSGy', 'Admin', '2025-08-19 07:27:17', '2025-08-19 07:27:17', NULL),
(11, 'Sales', 'sales@gmail.com', '$2b$10$ZDxsnhBJNP/JGSXasmMheueSXo00bWCiOrCiplnh.aFFzb9puWtYe', 'Sales', '2025-08-19 07:30:43', '2025-08-19 07:30:43', NULL),
(2502001, 'Head of Sales', 'hof@gmail.com', '$2b$10$V1WCXd/ah/D7ev6Ol69iP.R/FJDovydHLqkXS.pLie0xUpt/DEpJa', 'Head Sales', '2025-08-26 11:37:26', '2025-08-26 11:37:26', NULL),
(2503001, 'adit', 'adit@gmail.com', '$2b$10$ojbBxsvq9BQ8P8vhdEfFNOh7A2FzhXq.Q5ZzfsoxCyS0YhBAod5n2', 'Sales', '2025-08-27 13:08:32', '2025-08-27 13:08:32', '0812345'),
(2504001, 'aqip', 'aqip@gmail.com', '$2b$10$SAXGxt9dSavgtyM5UmCJ.uUFgvTvJ7JjEmz0vViJ0Nmc6tEavjIfC', 'Expert', '2025-08-28 08:09:46', '2025-08-28 08:09:46', '08123456789');

--
-- Indexes for dumped tables
--

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
  ADD KEY `idSkill` (`idSkill`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `opti`
--
ALTER TABLE `opti`
  ADD PRIMARY KEY (`idOpti`),
  ADD KEY `idCustomer` (`idCustomer`),
  ADD KEY `idSumber` (`idSumber`),
  ADD KEY `fk_opti_sales` (`idSales`);

--
-- Indexes for table `outsource`
--
ALTER TABLE `outsource`
  ADD PRIMARY KEY (`idOutsource`),
  ADD KEY `idSkill` (`idSkill`),
  ADD KEY `idCustomer` (`idCustomer`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`idProject`),
  ADD KEY `idCustomer` (`idCustomer`),
  ADD KEY `idSales` (`idSales`),
  ADD KEY `idExpert` (`idExpert`);

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
  ADD PRIMARY KEY (`idSales`),
  ADD KEY `userId` (`userId`);

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
  ADD KEY `idCustomer` (`idCustomer`);

--
-- Indexes for table `typetraining`
--
ALTER TABLE `typetraining`
  ADD PRIMARY KEY (`idTypeTraining`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `idCustomer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `expert`
--
ALTER TABLE `expert`
  MODIFY `idExpert` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `opti`
--
ALTER TABLE `opti`
  MODIFY `idOpti` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

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
  MODIFY `idSales` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
  MODIFY `idTraining` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `typetraining`
--
ALTER TABLE `typetraining`
  MODIFY `idTypeTraining` int(11) NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `expert_ibfk_1` FOREIGN KEY (`idSkill`) REFERENCES `skill` (`idSkill`),
  ADD CONSTRAINT `expert_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `opti`
--
ALTER TABLE `opti`
  ADD CONSTRAINT `fk_opti_sales` FOREIGN KEY (`idSales`) REFERENCES `sales` (`idSales`) ON UPDATE CASCADE,
  ADD CONSTRAINT `opti_ibfk_1` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`),
  ADD CONSTRAINT `opti_ibfk_2` FOREIGN KEY (`idSumber`) REFERENCES `sumber` (`idSumber`);

--
-- Constraints for table `outsource`
--
ALTER TABLE `outsource`
  ADD CONSTRAINT `outsource_ibfk_1` FOREIGN KEY (`idSkill`) REFERENCES `skill` (`idSkill`),
  ADD CONSTRAINT `outsource_ibfk_2` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`);

--
-- Constraints for table `project`
--
ALTER TABLE `project`
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
  ADD CONSTRAINT `training_ibfk_1` FOREIGN KEY (`idTypeTraining`) REFERENCES `typetraining` (`idTypeTraining`),
  ADD CONSTRAINT `training_ibfk_2` FOREIGN KEY (`idExpert`) REFERENCES `expert` (`idExpert`),
  ADD CONSTRAINT `training_ibfk_3` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
