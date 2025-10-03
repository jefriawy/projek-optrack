-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 03, 2025 at 10:15 AM
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
(2501003, 'Hidayat Santoso', '08127645123', 'santohidayat09@gmail.com', '$2b$10$JS/3w3s4VN0XQcyhwKF27.a8KEnTtN71gb9OEMClLcaUhwNe5F50i'),
(2501004, 'Ellie Setiabudi', '08956754987', 'budiel@gmail.com', '$2b$10$7/gxUmE3rRCoahqWOCpYCuLcECJjiPPDvJslu4MfJiZgD36iJrW62');

-- --------------------------------------------------------

--
-- Table structure for table `akademik`
--

CREATE TABLE `akademik` (
  `idAkademik` int(11) NOT NULL,
  `nmAkademik` varchar(255) DEFAULT NULL,
  `mobileAkademik` varchar(20) DEFAULT NULL,
  `emailAkademik` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `akademik`
--

INSERT INTO `akademik` (`idAkademik`, `nmAkademik`, `mobileAkademik`, `emailAkademik`, `password`) VALUES
(2511001, 'Joko Santoso', '08351256432', 'jokosans12@gmail.com', '$2b$10$bV4WDOQPginJNCvzleMos.DRtawxwmcngBny4W1xg3PLHjoEWfPku');

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
  `tglInput` datetime NOT NULL DEFAULT current_timestamp(),
  `customerCat` enum('Perusahaan','Pribadi') NOT NULL DEFAULT 'Perusahaan',
  `NPWP` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`idCustomer`, `nmCustomer`, `mobileCustomer`, `emailCustomer`, `addrCustomer`, `corpCustomer`, `idStatCustomer`, `descCustomer`, `idSales`, `tglInput`, `customerCat`, `NPWP`) VALUES
(2505001, 'Aditya Kusuma', '081298765432', 'aditya.kusuma@gmail.com', 'Jl. Raya Pahlawan No. 25, RT 03/RW 02, Kelurahan Sukamaju, Kecamatan Baru, Jakarta Selatan', 'PT Karya Nusantara', 2, 'Klien dari seminar', 2503003, '2025-09-08 20:00:00', 'Perusahaan', '01.123.456.7-890.123\n\n'),
(2505002, 'Amara Putri', '082367890123', 'amara.putri@outlook.com', 'Jl. Cendana Raya No. 10, Komplek Taman Bunga, Bandung Barat, Jawa Barat', 'CV Solusi Inovasi', 2, 'Butuh pelatihan SDM', 2503003, '2025-09-08 20:00:55', 'Perusahaan', '03.456.789.0-123.456\n\n'),
(2505003, 'Agung Wicaksono', '085490123456', 'agung.wicaksono@gmail.com', 'Jl. Sudirman Kav. 15, Perumahan Elite, Surabaya Utara, Jawa Timur', 'PT Vision Teknologi', 2, 'Potensi proyek besar', 2503003, '2025-09-08 20:02:01', 'Perusahaan', '06.987.654.3-210.987\n\n'),
(2505004, 'Chandra Lesmana', '087612345678', 'chandra.lesmana@hotmail.com', 'Jl. Malioboro No. 8, Gang Anggrek, Yogyakarta Selatan, DI Yogyakarta', 'PT Cerdas Mandiri', 2, 'Klien dari website', 2503003, '2025-09-08 20:02:55', 'Perusahaan', NULL),
(2505005, 'Diah Ayu', '089345678901', 'diah.ayu@gmail.com', 'Jl. Jendral Ahmad Yani No. 12, Komplek Perumahan Harmoni, Semarang Tengah, Jawa Tengah', 'CV Harmoni Jaya', 3, 'Memerlukan konsultasi', 2503003, '2025-09-08 20:03:37', 'Perusahaan', NULL),
(2505006, 'Bagas Seno', '081276543210', 'bagas.seno@gmail.com', 'Jl. Jenderal Sudirman No. 54, RT 02/RW 01, Karet Tengsin, Tanah Abang, Jakarta Pusat, DKI Jakarta 10220', 'PT Gemilang Teknologi', 2, 'Klien dari pameran', 2503004, '2025-09-08 20:06:08', 'Perusahaan', NULL),
(2505007, 'Candra Dharma', '082345678123', 'candra.dharma@outlook.com', 'Jl. Raya Pasteur No. 101, Sukajadi, Kota Bandung, Jawa Barat 40161', 'CV Inovasi Kreatif', 2, 'Butuh pelatihan online', 2503004, '2025-09-08 20:06:38', 'Perusahaan', NULL),
(2505008, 'Indra Nugraha', '085612345678', 'indra.nugraha@yahoo.com', 'Jl. Basuki Rachmat No. 12, Genteng, Surabaya Selatan, Jawa Timur 60271', 'PT Solusi Digital', 2, 'Potensi kontrak besar', 2503004, '2025-09-08 20:07:07', 'Perusahaan', NULL),
(2505009, 'Laksana Putra', '087890123456', 'laksana.putra@hotmail.com', 'Jl. Malioboro No. 28, Jetis, Yogyakarta Utara, DI Yogyakarta 55231', 'PT Harmoni Solusi', 2, 'Klien dari referral', 2503004, '2025-09-08 20:08:03', 'Perusahaan', NULL),
(2505010, 'Maulana Hadi', '089123456789', 'maulana.hadi@gmail.com', 'Jl. Pemuda No. 15, Semarang Tengah, Kota Semarang, Jawa Tengah 50139', 'CV Teknologi Cerdas', 3, 'Memerlukan konsultasi IT', 2503004, '2025-09-08 20:11:25', 'Perusahaan', NULL),
(2505011, 'Gita Permata', '081356789012', 'gita.permata@gmail.com', 'Jl. Diponegoro No. 45, RT 05/RW 03, Kelurahan Andir, Kecamatan Bandung Wetan, Kota Bandung, Jawa Barat 40114', 'PT Cahaya Abadi', 2, 'Klien dari pameran teknologi', 2503005, '2025-09-08 20:13:05', 'Perusahaan', NULL),
(2505012, 'Haris Kurnia', '082467890123', 'haris.kurnia@outlook.com', 'Jl. Gatot Subroto No. 72, Perumahan Graha Permata, Medan Baru, Kota Medan, Sumatera Utara 20152', 'CV Sentosa Jaya', 1, 'Memerlukan pelatihan manajemen', 2503005, '2025-09-08 20:13:49', 'Perusahaan', NULL),
(2505013, 'Niken Hartono', '085712345678', 'niken.hartono@yahoo.com', 'Jl. Raya Ujung Pandang No. 19, Komplek Citra Makassar, Tamalate, Kota Makassar, Sulawesi Selatan 90221', 'PT Nusantara Inovasi', 3, 'Potensi proyek infrastruktur', 2503005, '2025-09-08 20:14:25', 'Perusahaan', NULL),
(2505014, 'Pandu Setiawan', '087823456789', 'pandu.setiawan@hotmail.com', 'Jl. Hayam Wuruk No. 88, RT 01/RW 04, Kelurahan Pekojan, Kecamatan Tambora, Jakarta Barat, DKI Jakarta 11240', 'PT Bintang Terang', 1, 'Klien dari rekomendasi', 2503005, '2025-09-08 20:15:05', 'Perusahaan', NULL),
(2505015, 'Sekar Ayu', '089134567890', 'sekar.ayu@proton.me', 'Jl. Raya Denpasar No. 33, Banjar Tegal, Kecamatan Denpasar Utara, Kota Denpasar, Bali 80115', 'CV Harmoni Bali', 2, 'Butuh konsultasi pariwisata', 2503005, '2025-09-08 20:15:42', 'Perusahaan', NULL),
(2505016, 'Arjuna Satria', '081547890123', 'arjuna.satria@gmail.com', 'Jl. A. Yani No. 67, RT 04/RW 02, Kelurahan Sukarame, Kecamatan Banjarmasin Utara, Kota Banjarmasin, Kalimantan Selatan 70234', 'PT Sinar Jaya', 1, 'Klien dari pameran industri', 2503006, '2025-09-08 20:18:01', 'Perusahaan', NULL),
(2505017, 'Bima Wijaya', '082678901234', 'bima.wijaya@outlook.com', 'Jl. Sam Ratulangi No. 23, Komplek Harmoni, Manado Utara, Kota Manado, Sulawesi Utara 95111', 'CV Makmur Sejahtera', 2, 'Butuh pelatihan keuangan', 2503006, '2025-09-08 20:18:37', 'Perusahaan', NULL),
(2505018, 'Citra Anggraini', '085789012345', 'citra.anggraini@yahoo.com', 'Jl. Raya Pasar Baru No. 14, Kelurahan Pasar Baru, Kecamatan Sawah Besar, Jakarta Pusat, DKI Jakarta 10710', 'PT Gemilang Nusantara', 3, 'Potensi proyek logistik', 2503006, '2025-09-08 20:19:09', 'Perusahaan', NULL),
(2505019, 'Danar Pratama', '087890123456', 'danar.pratama@hotmail.com', 'Jl. Ahmad Dahlan No. 19, Perumahan Taman Sari, Malang Selatan, Kota Malang, Jawa Timur 65146', 'PT Cakra Teknologi', 2, 'Klien dari media sosial', 2503006, '2025-09-08 20:19:40', 'Perusahaan', NULL),
(2505020, 'Eka Wulan Sari', '089123456789', 'eka.wulan.sari@gmail.com', 'Jl. Raya Kupang Baru No. 8, Kelurahan Oebobo, Kecamatan Kupang Barat, Kota Kupang, Nusa Tenggara Timur 85111', 'CV Bintang Timur', 1, 'Memerlukan konsultasi pemasaran', 2503006, '2025-09-08 20:20:12', 'Perusahaan', NULL),
(2505021, 'Jaka Lesmana', '081623456789', 'jaka.lesmana@gmail.com', 'Jl. Sultan Hasanuddin No. 34, RT 03/RW 01, Kelurahan Batu Putih, Kecamatan Baubau, Kota Baubau, Sulawesi Tenggara 93719', 'PT Samudra Jaya', 2, 'Klien dari event maritim', 2503007, '2025-09-08 20:22:27', 'Perusahaan', NULL),
(2505022, 'Kadek Wibowo', '082734567890', 'kadek.wibowo@outlook.com', 'Jl. Raya Padang Panjang No. 17, Nagari Batu Tabal, Kecamatan Tanah Datar, Kabupaten Tanah Datar, Sumatera Barat 27172', 'CV Alam Lestari', 1, 'Butuh pelatihan pertanian', 2503007, '2025-09-08 20:23:00', 'Perusahaan', NULL),
(2505023, 'Larasati Angga', '085845678901', 'larasati.angga@yahoo.com', 'Jl. Ahmad Yani No. 22, Komplek Perumahan Kaltim, Samarinda Ulu, Kota Samarinda, Kalimantan Timur 75123', 'PT Hijau Makmur', 1, 'Potensi proyek kehutanan', 2503007, '2025-09-08 20:23:32', 'Perusahaan', NULL),
(2505024, 'Mahardika Surya', '087956789012', 'mahardika.surya@hotmail.com', 'Jl. Raya Sentani No. 9, Kampung Harapan, Kecamatan Sentani, Kabupaten Jayapura, Papua 99351', 'PT Papua Cerdas', 2, 'Klien dari program CSR', 2503007, '2025-09-08 20:24:01', 'Perusahaan', NULL),
(2505025, 'Naufal Amarta', '089167890123', 'naufal.amarta@gmail.com', 'Jl. Pattimura No. 15, Kelurahan Tulehu, Kecamatan Salahutu, Kabupaten Maluku Tengah, Maluku 97581', 'CV Nusantara Laut', 1, 'Memerlukan konsultasi kelautan', 2503007, '2025-09-08 20:24:42', 'Perusahaan', NULL),
(2505026, 'Jeefri Gus Away', '085156118910', 'jefriaway@gmail.com', ' Jalan Mawar Indah No. 12  Desa: Desa Mekarsari  Kecamatan: Kecamatan Cipta Alam  Kota: Kabupaten Bandung  Provinsi: Jawa Barat  Kode Pos: 40123', '', 1, 'Peduli dengan kesehatan dan lingkungan, suka olahraga yoga, sering membaca artikel seputar gaya hidup sehat, dan lebih memilih produk alami atau organik.', 2503006, '2025-09-12 19:42:25', 'Pribadi', ''),
(2505027, 'anton', '08999222', 'anton@gmail.com', 'jl mangga', '', 1, 'test', 2502003, '2025-09-30 22:20:15', 'Pribadi', '');

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
  `Row` text DEFAULT NULL,
  `role` enum('Expert','Head of Expert','Trainer') DEFAULT 'Expert'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expert`
--

INSERT INTO `expert` (`idExpert`, `nmExpert`, `mobileExpert`, `emailExpert`, `password`, `idSkill`, `statExpert`, `Row`, `role`) VALUES
(2504004, 'Rima Ayu', '089585681402', 'arimakanayu@gmail.com', '$2b$10$K0noNs2NNMsFcfE7X0H2rOmWUV0mhvgsylWku8/0UIwOpJk9s1DK.', 6, NULL, NULL, 'Expert'),
(2504005, 'Kresna Saraswati', '08129421087', 'saraswatikresna@gmail.com', '$2b$10$KhCOIL/QsPmMmwRV6nfQSurqBXx2Tpnf3piyd2hHZe8MsIhQkvrdi', 10, NULL, NULL, 'Expert'),
(2504006, 'Yudha Pratama', '08128321592', 'yudhapratamaass18@gmail.com', '$2b$10$HUAJLd9Y3wQjcAtJ9jb8ueEklJfA1l8ND5XzZucHjFKbOxrx5QZni', 9, NULL, NULL, 'Expert'),
(2504007, 'Restu Ardianto', '08126754402', 'ardianto812@gmail.com', '$2b$10$Fk0bv7JQf.SMbyPpaoMzguPpmNMTDMed7x9gNsCk15ZRs0m1oaGSa', 2, NULL, NULL, 'Expert'),
(2504008, 'Kania Rahmawati', '08126932444', 'rahmakaniawati@gmail.com', '$2b$10$ckga.EmM0P1K7NCOyfYYSed8zPLM5QdVPDZlGN7NPau.rsReSyXu.', 5, NULL, NULL, 'Expert'),
(2514002, 'Bowo Sujatmiko', '081341126767', 'sujimatmokobowo@gmail.com', '$2b$10$CvXXzejPiHLV4VkLmN834ecc2SBeXK9aiXURaUdLDBwN6nJODWEMe', 9, NULL, NULL, 'Trainer'),
(2514003, 'Khairul Lecher', '084416160155', 'khairullecher@gmail.com', '$2b$10$YJsiuItq81lkei1di5vVxOXCqZeAPKoEDzwnvNQRJ/GRmGrAzjNE2', 10, NULL, NULL, 'Trainer');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` bigint(20) NOT NULL,
  `recipient_user_id` varchar(20) NOT NULL,
  `recipient_role` varchar(20) NOT NULL,
  `sender_user_id` varchar(20) DEFAULT NULL,
  `sender_name` varchar(100) DEFAULT NULL,
  `message` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `related_entity_id` varchar(20) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `recipient_user_id`, `recipient_role`, `sender_user_id`, `sender_name`, `message`, `type`, `related_entity_id`, `is_read`, `created_at`) VALUES
(1, 'ALL_ROLE', 'Head Sales', '2503003', 'Galang Pratama', 'Sales (Galang Pratama) Telah menambahkan Customer', 'customer_added', '2505027', 1, '2025-09-29 14:32:52'),
(2, 'ALL_ROLE', 'Head Sales', '2503003', 'Galang Pratama', 'Sales (Galang Pratama) Telah mengupdate Customer', 'customer_updated', '2505027', 1, '2025-09-29 14:33:15'),
(3, 'ALL_ROLE', 'Head Sales', '2503003', 'Galang Pratama', 'Sales (Galang Pratama) Telah menambahkan Customer', 'customer_added', '2505028', 1, '2025-09-29 14:34:44'),
(4, 'ALL_ROLE', 'Head Sales', '2503003', 'Galang Pratama', 'Sales (Galang Pratama) Telah mengupdate Customer', 'customer_updated', '2505028', 1, '2025-09-29 14:35:25'),
(5, '2503003', 'Sales', '2502003', 'Surya Legowo', 'Head Sales (Surya Legowo) Telah Mengupdate Status Customer menjadi Approved', 'customer_status_changed_sales', '2505028', 1, '2025-09-29 14:54:52'),
(6, 'ALL_ROLE', 'Head Sales', '2503003', 'Galang Pratama', 'Sales (Galang Pratama) Telah menambahkan Customer', 'customer_added', '2505029', 1, '2025-09-29 14:56:43'),
(7, 'ALL_ROLE', 'Head Sales', '2503003', 'Galang Pratama', 'Sales (Galang Pratama) Telah mengupdate Customer', 'customer_updated', '2505029', 1, '2025-09-29 14:57:00'),
(8, '2503003', 'Sales', '2502003', 'Surya Legowo', 'Head Sales (Surya Legowo) Telah Mengupdate Status Customer menjadi Reject', 'customer_status_changed_sales', '2505029', 1, '2025-09-29 15:00:22'),
(9, 'ALL_ROLE', 'Head Sales', '2503003', 'Galang Pratama', 'Sales (Galang Pratama) Telah menambahkan Customer', 'customer_added', '2505030', 1, '2025-09-29 15:47:28'),
(10, 'ALL_ROLE', 'Head Sales', '2503003', 'Galang Pratama', 'Sales (Galang Pratama) Telah mengupdate Customer', 'customer_updated', '2505030', 1, '2025-09-29 15:47:49'),
(11, '2503003', 'Sales', '2502003', 'Surya Legowo', 'Head Sales (Surya Legowo) Telah Mengupdate Status Customer menjadi Reject', 'customer_status_changed_sales', '2505030', 1, '2025-09-29 15:48:29'),
(12, '2503006', 'Sales', '2502003', 'Surya Legowo', 'Head Sales (Surya Legowo) Telah Mengupdate Status Customer (Jeefri Gus Away) menjadi Reject', 'customer_status_updated', '2505026', 0, '2025-09-30 22:18:48'),
(13, '2503006', 'Sales', '2502003', 'Surya Legowo', 'Head Sales (Surya Legowo) Telah Mengupdate Status Customer (Jeefri Gus Away) menjadi Review', 'customer_status_updated', '2505026', 0, '2025-09-30 22:18:53'),
(14, 'ALL_ROLE', 'Head Sales', '2502003', 'Surya Legowo', 'Sales (Surya Legowo) Telah menambahkan Customer: anton', 'customer_added', '2505027', 1, '2025-09-30 22:20:15'),
(15, '2503005', 'Sales', '2502003', 'Surya Legowo', 'Head Sales (Surya Legowo) Telah Mengupdate Status OPTI (project 1) menjadi po received', 'opti_status_updated', '2506057', 0, '2025-10-03 14:53:25');

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
  `statOpti` enum('opti entry','opti failed','opti on going','po received') DEFAULT 'opti entry',
  `datePropOpti` date DEFAULT NULL,
  `idCustomer` int(11) DEFAULT NULL,
  `kebutuhan` text DEFAULT NULL,
  `idSumber` int(11) DEFAULT NULL,
  `idSales` int(11) NOT NULL,
  `jenisOpti` varchar(50) NOT NULL,
  `idExpert` int(11) DEFAULT NULL,
  `idPM` int(11) DEFAULT NULL,
  `proposalOpti` varchar(255) DEFAULT NULL,
  `valOpti` int(11) DEFAULT NULL,
  `startProgram` datetime DEFAULT NULL,
  `endProgram` datetime DEFAULT NULL,
  `placeProgram` varchar(255) DEFAULT NULL,
  `idTypeTraining` int(11) DEFAULT NULL,
  `idTypeProject` int(11) DEFAULT NULL,
  `dokPendaftaran` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `opti`
--

INSERT INTO `opti` (`idOpti`, `nmOpti`, `contactOpti`, `mobileOpti`, `emailOpti`, `statOpti`, `datePropOpti`, `idCustomer`, `kebutuhan`, `idSumber`, `idSales`, `jenisOpti`, `idExpert`, `idPM`, `proposalOpti`, `valOpti`, `startProgram`, `endProgram`, `placeProgram`, `idTypeTraining`, `idTypeProject`, `dokPendaftaran`) VALUES
(2506001, 'Pelatihan Manajemen Program CSR', 'Jaka Lesmana', '081623456789', 'jaka.lesmana@gmail.com', 'po received', '2025-09-22', 2505001, 'Pelatihan Leadership via Zoom , info ruang tunggu klien. ', 2, 2503003, 'Training', 2514003, NULL, '1758556287739.pdf', 12000000, '2025-09-22 22:54:00', '2025-09-27 22:54:00', 'Zoom', 2, NULL, '1758556398370_dokumen_pendaftaran_Contoh Bukti Pembayaran (SAMPLE).pdf'),
(2506002, 'Pelatihan Analisis Data & Strategi Bisnis', 'Jefri Ramadhan', '08351256432', 'jepriguy@gmail.com', 'opti on going', '2025-09-22', 2505003, 'Pak agung meminta untuk mengadakan sebuah training analisis data ', 1, 2503003, 'Training', 2514002, NULL, '1758556386562.pdf', 150000000, NULL, NULL, 'Azana Hotel Jakarta Airport - Jakarta', 2, NULL, NULL),
(2506032, 'Leadership Workshop - PT Karya Nusantara', 'Ani Santoso', '081881191903', 'ani.santoso1@example.com', 'opti entry', '2025-09-24', 2505001, 'Kebutuhan mendesak untuk pelatihan leadership workshop bagi tim.', 3, 2503003, 'Training', 2514003, NULL, NULL, 18800000, NULL, NULL, 'Online via Microsoft Teams', 3, NULL, NULL),
(2506033, 'Digital Marketing Seminar - PT Vision Teknologi', 'Lina Wijaya', '081993892367', 'lina.wijaya23@example.com', 'opti entry', '2025-09-24', 2505003, 'Kebutuhan mendesak untuk pelatihan digital marketing seminar bagi tim.', 1, 2503003, 'Training', 2514002, NULL, NULL, 19700000, NULL, NULL, 'Hotel Grand Hyatt, Bali', 4, NULL, NULL),
(2506034, 'Advanced Excel Training - CV Solusi Inovasi', 'Joko Kusuma', '081633493788', 'joko.kusuma45@example.com', 'opti entry', '2025-09-24', 2505002, 'Kebutuhan mendesak untuk pelatihan advanced excel training bagi tim.', 2, 2503003, 'Training', 2514003, NULL, NULL, 18000000, NULL, NULL, 'Online via Zoom', 2, NULL, NULL),
(2506035, 'Project Management Certification - PT Cerdas Mandiri', 'Dewi Lestari', '081603325943', 'dewi.lestari67@example.com', 'opti entry', '2025-09-24', 2505004, 'Kebutuhan mendesak untuk pelatihan project management certification bagi tim.', 3, 2503003, 'Training', 2514002, NULL, NULL, 22300000, NULL, NULL, 'Kantor Pusat Klien', 3, NULL, NULL),
(2506036, 'Cybersecurity Awareness - CV Harmoni Jaya', 'Rina Pratama', '081838858556', 'rina.pratama89@example.com', 'opti entry', '2025-09-24', 2505005, 'Kebutuhan mendesak untuk pelatihan cybersecurity awareness bagi tim.', 1, 2503003, 'Training', 2514003, NULL, NULL, 22000000, NULL, NULL, 'Surabaya Co-working Space', 4, NULL, NULL),
(2506037, 'Cloud Computing Basics - PT Solusi Digital', 'Agus Setiawan', '081877903743', 'agus.setiawan11@example.com', 'opti entry', '2025-09-24', 2505008, 'Kebutuhan mendesak untuk pelatihan cloud computing basics bagi tim.', 2, 2503004, 'Training', 2514002, NULL, NULL, 19000000, NULL, NULL, 'Hotel Aston, Jakarta', 2, NULL, NULL),
(2506038, 'Data Analysis with Python - PT Gemilang Teknologi', 'Siti Hidayat', '081911258391', 'siti.hidayat33@example.com', 'opti entry', '2025-09-24', 2505006, 'Kebutuhan mendesak untuk pelatihan data analysis with python bagi tim.', 3, 2503004, 'Training', 2514003, NULL, NULL, 28000000, NULL, NULL, 'Online via Microsoft Teams', 3, NULL, NULL),
(2506039, 'Customer Service Excellence - CV Teknologi Cerdas', 'Eko Putri', '081672199393', 'eko.putri55@example.com', 'opti entry', '2025-09-24', 2505010, 'Kebutuhan mendesak untuk pelatihan customer service excellence bagi tim.', 1, 2503004, 'Training', 2514002, NULL, NULL, 16000000, NULL, NULL, 'Ruang Meeting Perusahaan', 4, NULL, NULL),
(2506040, 'Agile & Scrum Fundamentals - PT Harmoni Solusi', 'Budi Nugroho', '081782833586', 'budi.nugroho77@example.com', 'opti entry', '2025-09-24', 2505009, 'Kebutuhan mendesak untuk pelatihan agile & scrum fundamentals bagi tim.', 2, 2503004, 'Training', 2514003, NULL, NULL, 21000000, NULL, NULL, 'Yogyakarta Expo Center', 2, NULL, NULL),
(2506041, 'Public Speaking Masterclass - CV Inovasi Kreatif', 'Adi Wati', '081613398889', 'adi.wati99@example.com', 'opti entry', '2025-09-24', 2505007, 'Kebutuhan mendesak untuk pelatihan public speaking masterclass bagi tim.', 3, 2503004, 'Training', 2514002, NULL, NULL, 17500000, NULL, NULL, 'Hotel Aston, Jakarta', 3, NULL, NULL),
(2506042, 'Leadership Workshop - PT Bintang Terang', 'Lina Santoso', '081195118248', 'lina.santoso12@example.com', 'opti entry', '2025-09-24', 2505014, 'Kebutuhan mendesak untuk pelatihan leadership workshop bagi tim.', 1, 2503005, 'Training', 2514003, NULL, NULL, 26000000, NULL, NULL, 'Online via Zoom', 4, NULL, NULL),
(2506043, 'Digital Marketing Seminar - CV Sentosa Jaya', 'Joko Wijaya', '081884986899', 'joko.wijaya34@example.com', 'opti entry', '2025-09-24', 2505012, 'Kebutuhan mendesak untuk pelatihan digital marketing seminar bagi tim.', 2, 2503005, 'Training', 2514002, NULL, NULL, 14000000, NULL, NULL, 'Kantor Pusat Klien', 2, NULL, NULL),
(2506044, 'Advanced Excel Training - PT Nusantara Inovasi', 'Dewi Kusuma', '081438862153', 'dewi.kusuma56@example.com', 'opti entry', '2025-09-24', 2505013, 'Kebutuhan mendesak untuk pelatihan advanced excel training bagi tim.', 3, 2503005, 'Training', 2514003, NULL, NULL, 19500000, NULL, NULL, 'Bandung Convention Center', 3, NULL, NULL),
(2506045, 'Project Management Certification - CV Harmoni Bali', 'Rina Lestari', '081222583943', 'rina.lestari78@example.com', 'opti entry', '2025-09-24', 2505015, 'Kebutuhan mendesak untuk pelatihan project management certification bagi tim.', 1, 2503005, 'Training', 2514002, NULL, NULL, 32000000, NULL, NULL, 'Surabaya Co-working Space', 4, NULL, NULL),
(2506046, 'Cybersecurity Awareness - PT Cahaya Abadi', 'Agus Pratama', '081628933940', 'agus.pratama90@example.com', 'opti entry', '2025-09-24', 2505011, 'Kebutuhan mendesak untuk pelatihan cybersecurity awareness bagi tim.', 2, 2503005, 'Training', 2514003, NULL, NULL, 23000000, NULL, NULL, 'Hotel Grand Hyatt, Bali', 2, NULL, NULL),
(2506047, 'Cloud Computing Basics - PT Gemilang Nusantara', 'Siti Setiawan', '081881858468', 'siti.setiawan13@example.com', 'opti entry', '2025-09-24', 2505018, 'Kebutuhan mendesak untuk pelatihan cloud computing basics bagi tim.', 3, 2503006, 'Training', 2514002, NULL, NULL, 20000000, NULL, NULL, 'Online via Microsoft Teams', 3, NULL, NULL),
(2506048, 'Data Analysis with Python - CV Bintang Timur', 'Eko Hidayat', '081283600956', 'eko.hidayat24@example.com', 'opti entry', '2025-09-24', 2505020, 'Kebutuhan mendesak untuk pelatihan data analysis with python bagi tim.', 1, 2503006, 'Training', 2514003, NULL, NULL, 29000000, NULL, NULL, 'Ruang Meeting Perusahaan', 4, NULL, NULL),
(2506049, 'Customer Service Excellence', 'Budi Putri', '081683865339', 'budi.putri46@example.com', 'opti entry', '2025-09-24', 2505026, 'Kebutuhan mendesak untuk pelatihan customer service excellence bagi tim.', 2, 2503006, 'Training', 2514002, NULL, NULL, 17000000, NULL, NULL, 'Yogyakarta Expo Center', 2, NULL, NULL),
(2506050, 'Agile & Scrum Fundamentals - PT Sinar Jaya', 'Adi Nugroho', '081251848589', 'adi.nugroho68@example.com', 'opti entry', '2025-09-24', 2505016, 'Kebutuhan mendesak untuk pelatihan agile & scrum fundamentals bagi tim.', 3, 2503006, 'Training', 2514003, NULL, NULL, 22500000, NULL, NULL, 'Hotel Aston, Jakarta', 3, NULL, NULL),
(2506051, 'Public Speaking Masterclass - PT Cakra Teknologi', 'Lina Wati', '081226891332', 'lina.wati80@example.com', 'opti entry', '2025-09-24', 2505019, 'Kebutuhan mendesak untuk pelatihan public speaking masterclass bagi tim.', 1, 2503006, 'Training', 2514002, NULL, NULL, 18500000, NULL, NULL, 'Online via Zoom', 4, NULL, NULL),
(2506052, 'Leadership Workshop - PT Hijau Makmur', 'Joko Santoso', '081618538268', 'joko.santoso21@example.com', 'opti entry', '2025-09-24', 2505023, 'Kebutuhan mendesak untuk pelatihan leadership workshop bagi tim.', 2, 2503007, 'Training', 2514003, NULL, NULL, 27000000, NULL, NULL, 'Kantor Pusat Klien', 2, NULL, NULL),
(2506053, 'Digital Marketing Seminar - CV Nusantara Laut', 'Dewi Wijaya', '081835931129', 'dewi.wijaya43@example.com', 'opti entry', '2025-09-24', 2505025, 'Kebutuhan mendesak untuk pelatihan digital marketing seminar bagi tim.', 3, 2503007, 'Training', 2514002, NULL, NULL, 15500000, NULL, NULL, 'Bandung Convention Center', 3, NULL, NULL),
(2506054, 'Advanced Excel Training - PT Samudra Jaya', 'Rina Kusuma', '081258398488', 'rina.kusuma65@example.com', 'opti entry', '2025-09-24', 2505021, 'Kebutuhan mendesak untuk pelatihan advanced excel training bagi tim.', 1, 2503007, 'Training', 2514003, NULL, NULL, 20500000, NULL, NULL, 'Surabaya Co-working Space', 4, NULL, NULL),
(2506055, 'Project Management Certification - CV Alam Lestari', 'Agus Lestari', '081228499019', 'agus.lestari87@example.com', 'opti entry', '2025-09-24', 2505022, 'Kebutuhan mendesak untuk pelatihan project management certification bagi tim.', 2, 2503007, 'Training', 2514002, NULL, NULL, 33000000, NULL, NULL, 'Hotel Grand Hyatt, Bali', 2, NULL, NULL),
(2506056, 'Cybersecurity Awareness - PT Papua Cerdas', 'Siti Pratama', '081339831379', 'siti.pratama99@example.com', 'opti entry', '2025-09-24', 2505024, 'Kebutuhan mendesak untuk pelatihan cybersecurity awareness bagi tim.', 3, 2503007, 'Training', 2514003, NULL, NULL, 24000000, NULL, NULL, 'Online via Microsoft Teams', 3, NULL, NULL),
(2506057, 'project 1', 'samuel', '0899887766', 'samuel@gmail.com', 'po received', '2025-10-03', 2505015, 'sdawsddaw', 2, 2503005, 'Project', NULL, 2512001, 'Contoh Bukti Pembayaran (SAMPLE).pdf', 12000000, '2025-10-03 14:56:00', '2025-10-03 14:59:00', 'gedung a', NULL, 3, 'Contoh Bukti Pembayaran (SAMPLE).pdf');

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
-- Table structure for table `pm`
--

CREATE TABLE `pm` (
  `idPM` int(11) NOT NULL,
  `nmPM` varchar(255) DEFAULT NULL,
  `mobilePM` varchar(20) DEFAULT NULL,
  `emailPM` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pm`
--

INSERT INTO `pm` (`idPM`, `nmPM`, `mobilePM`, `emailPM`, `password`) VALUES
(2512001, 'Hendra Gunawan', '08571212700', 'hendragunawannn@gmail.com', '$2b$10$aFkwKM6WyoGFlLU0wWb/CO6/2slAFU19ArYrJXTOjAcKOJEftzKye');

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
  `idExpert` int(11) DEFAULT NULL,
  `placeProject` varchar(255) DEFAULT NULL,
  `idCustomer` int(11) DEFAULT NULL,
  `idOpti` int(11) DEFAULT NULL,
  `statusProject` enum('Pending','On Progress','Finished') NOT NULL DEFAULT 'Pending',
  `fbProject` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`idProject`, `nmProject`, `idTypeProject`, `startProject`, `endProject`, `idExpert`, `placeProject`, `idCustomer`, `idOpti`, `statusProject`, `fbProject`) VALUES
(2508001, 'project 1', 3, '2025-10-03 14:56:00', '2025-10-03 14:59:00', NULL, 'gedung a', 2505015, 2506057, 'Finished', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `recent_activities`
--

CREATE TABLE `recent_activities` (
  `id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `related_id` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recent_activities`
--

INSERT INTO `recent_activities` (`id`, `type`, `description`, `related_id`, `timestamp`) VALUES
(1, 'feedback', 'Feedback baru dari training: \"pelatihan coaching si\"', '2507001', '2025-09-17 17:01:07'),
(2, 'feedback', 'Feedback baru dari training: \"pelatihan coaching si\"', '2507001', '2025-09-17 17:27:25'),
(3, 'feedback', 'Feedback baru dari training: \"pelatihan coaching si\"', '2507001', '2025-09-17 17:39:50'),
(4, 'feedback', 'Feedback baru dari training: \"pelatihan coaching si\"', '2507001', '2025-09-17 17:47:11'),
(5, 'feedback', 'Feedback baru dari training: \"pelatihan coaching si\"', '2507001', '2025-09-17 17:47:22'),
(6, 'feedback', 'Feedback baru dari training: \"Ujian Gelar PRINCE\"', '2507002', '2025-09-17 18:27:58'),
(7, 'feedback', 'Feedback baru dari training: \"pelatihan coaching si\"', '2507001', '2025-09-17 18:31:35'),
(8, 'feedback', 'Feedback baru dari training: \"pelatihan coaching aja\"', '2507003', '2025-09-22 09:05:55'),
(9, 'feedback', 'Feedback baru dari training: \"pelatihan coaching aja\"', '2507003', '2025-09-22 09:06:37');

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
(2502003, 'Surya Legowo', '08128734128', 'legowoissuryaaas@gmail.com', '$2b$10$ggi/X6ViK6TJGuSzAosO9.RZ6fpvOQhoUlKyiBXMfByBOP1XvAzlS', NULL, 'Head Sales'),
(2503003, 'Galang Pratama', '08124532876', 'galangprat@outlook.com', '$2b$10$8baP7/VYzHxhNtFNh//YUexnTHopphmb1CclbJhDMblghjNT81acy', NULL, 'Sales'),
(2503004, 'Kirana Dwi', '08974123509', 'dwiki.handayani@gmail.com', '$2b$10$zEpx60FthUH9lKXZwxeKe.cCyDSwYaTuo9nyN5HQSBNwN4.YC7Dl6', NULL, 'Sales'),
(2503005, 'Yanto Jamaluddin', '08126130841', 'yantojumali@gmail.com', '$2b$10$o.oODbRAa3pEDgTT05za2.XOaHkXH9oL5LMz.wCGQads3vWAOx6fu', NULL, 'Sales'),
(2503006, 'Arya Raharjo', '08124832092', 'aryaharjo123@outlook.com', '$2b$10$0ctA1FNVXZrseqZ4L3VTXeeLFIe5GIoL2gwH3mgYVXvY3nJJ4W0ia', NULL, 'Sales'),
(2503007, 'Gita Lesmana', '08127023567', 'lesmanagita@gmail.com', '$2b$10$RgmtVoH4iPgiM8I9LLIraOiBxxMaxbvG8.R4npW0kmJzkLRwgxnV2', NULL, 'Sales');

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
(1, 'JavaScript Development', 'Active', 'Keahlian dalam pengembangan aplikasi menggunakan JavaScript, termasuk ES6ுடன்.'),
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
  `idCustomer` int(11) DEFAULT NULL,
  `idOpti` int(11) DEFAULT NULL,
  `statusTraining` enum('Po Received','Training On Progress','Training Delivered') NOT NULL DEFAULT 'Po Received',
  `fbTraining` varchar(255) DEFAULT NULL,
  `fbAttachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`fbAttachments`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `training`
--

INSERT INTO `training` (`idTraining`, `nmTraining`, `idTypeTraining`, `startTraining`, `endTraining`, `idExpert`, `placeTraining`, `idCustomer`, `idOpti`, `statusTraining`, `fbTraining`, `fbAttachments`) VALUES
(2507001, 'Pelatihan Manajemen Program CSR', 2, '2025-09-22 22:54:00', '2025-09-27 22:54:00', 2514003, 'Zoom', 2505001, 2506001, 'Training Delivered', NULL, NULL);

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
-- Indexes for table `akademik`
--
ALTER TABLE `akademik`
  ADD PRIMARY KEY (`idAkademik`),
  ADD UNIQUE KEY `emailAkademik` (`emailAkademik`);

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
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_recipient` (`recipient_user_id`,`is_read`);

--
-- Indexes for table `opti`
--
ALTER TABLE `opti`
  ADD PRIMARY KEY (`idOpti`),
  ADD KEY `idCustomer` (`idCustomer`),
  ADD KEY `idSumber` (`idSumber`),
  ADD KEY `idSales` (`idSales`),
  ADD KEY `idExpert` (`idExpert`),
  ADD KEY `idTypeTraining` (`idTypeTraining`),
  ADD KEY `idTypeProject` (`idTypeProject`),
  ADD KEY `fk_opti_pm` (`idPM`);

--
-- Indexes for table `outsource`
--
ALTER TABLE `outsource`
  ADD PRIMARY KEY (`idOutsource`),
  ADD KEY `idSkill` (`idSkill`),
  ADD KEY `idCustomer` (`idCustomer`),
  ADD KEY `fk_outsource_opti_idx` (`idOpti`);

--
-- Indexes for table `pm`
--
ALTER TABLE `pm`
  ADD PRIMARY KEY (`idPM`),
  ADD UNIQUE KEY `emailPM` (`emailPM`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`idProject`),
  ADD KEY `idCustomer` (`idCustomer`),
  ADD KEY `idExpert` (`idExpert`),
  ADD KEY `fk_project_opti_idx` (`idOpti`),
  ADD KEY `fk_project_type` (`idTypeProject`);

--
-- Indexes for table `recent_activities`
--
ALTER TABLE `recent_activities`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `idAdmin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2501006;

--
-- AUTO_INCREMENT for table `akademik`
--
ALTER TABLE `akademik`
  MODIFY `idAkademik` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2511004;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `idCustomer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2505031;

--
-- AUTO_INCREMENT for table `expert`
--
ALTER TABLE `expert`
  MODIFY `idExpert` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2514004;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `opti`
--
ALTER TABLE `opti`
  MODIFY `idOpti` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2506059;

--
-- AUTO_INCREMENT for table `outsource`
--
ALTER TABLE `outsource`
  MODIFY `idOutsource` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pm`
--
ALTER TABLE `pm`
  MODIFY `idPM` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2512003;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `idProject` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2508008;

--
-- AUTO_INCREMENT for table `recent_activities`
--
ALTER TABLE `recent_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `idSales` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2503009;

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
  MODIFY `idTraining` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2507014;

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
  ADD CONSTRAINT `fk_opti_pm` FOREIGN KEY (`idPM`) REFERENCES `pm` (`idPM`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `opti_ibfk_1` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`),
  ADD CONSTRAINT `opti_ibfk_2` FOREIGN KEY (`idSumber`) REFERENCES `sumber` (`idSumber`),
  ADD CONSTRAINT `opti_ibfk_3` FOREIGN KEY (`idSales`) REFERENCES `sales` (`idSales`),
  ADD CONSTRAINT `opti_ibfk_4` FOREIGN KEY (`idExpert`) REFERENCES `expert` (`idExpert`),
  ADD CONSTRAINT `opti_ibfk_5` FOREIGN KEY (`idTypeTraining`) REFERENCES `typetraining` (`idTypeTraining`),
  ADD CONSTRAINT `opti_ibfk_6` FOREIGN KEY (`idTypeProject`) REFERENCES `typeproject` (`idTypeProject`);

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
