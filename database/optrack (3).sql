-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 15 Sep 2025 pada 08.15
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.1.25

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
-- Struktur dari tabel `admin`
--

CREATE TABLE `admin` (
  `idAdmin` int(11) NOT NULL,
  `nmAdmin` varchar(255) DEFAULT NULL,
  `mobileAdmin` varchar(20) DEFAULT NULL,
  `emailAdmin` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admin`
--

INSERT INTO `admin` (`idAdmin`, `nmAdmin`, `mobileAdmin`, `emailAdmin`, `password`) VALUES
(2501003, 'Hidayat Santoso', '08127645123', 'santohidayat09@gmail.com', '$2b$10$JS/3w3s4VN0XQcyhwKF27.a8KEnTtN71gb9OEMClLcaUhwNe5F50i'),
(2501004, 'Ellie Setiabudi', '08956754987', 'budiel@gmail.com', '$2b$10$7/gxUmE3rRCoahqWOCpYCuLcECJjiPPDvJslu4MfJiZgD36iJrW62');

-- --------------------------------------------------------

--
-- Struktur dari tabel `customer`
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
-- Dumping data untuk tabel `customer`
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
(2505017, 'Bima Wijaya', '082678901234', 'bima.wijaya@outlook.com', 'Jl. Sam Ratulangi No. 23, Komplek Harmoni, Manado Utara, Kota Manado, Sulawesi Utara 95111', 'CV Makmur Sejahtera', 1, 'Butuh pelatihan keuangan', 2503006, '2025-09-08 20:18:37', 'Perusahaan', NULL),
(2505018, 'Citra Anggraini', '085789012345', 'citra.anggraini@yahoo.com', 'Jl. Raya Pasar Baru No. 14, Kelurahan Pasar Baru, Kecamatan Sawah Besar, Jakarta Pusat, DKI Jakarta 10710', 'PT Gemilang Nusantara', 1, 'Potensi proyek logistik', 2503006, '2025-09-08 20:19:09', 'Perusahaan', NULL),
(2505019, 'Danar Pratama', '087890123456', 'danar.pratama@hotmail.com', 'Jl. Ahmad Dahlan No. 19, Perumahan Taman Sari, Malang Selatan, Kota Malang, Jawa Timur 65146', 'PT Cakra Teknologi', 2, 'Klien dari media sosial', 2503006, '2025-09-08 20:19:40', 'Perusahaan', NULL),
(2505020, 'Eka Wulan Sari', '089123456789', 'eka.wulan.sari@gmail.com', 'Jl. Raya Kupang Baru No. 8, Kelurahan Oebobo, Kecamatan Kupang Barat, Kota Kupang, Nusa Tenggara Timur 85111', 'CV Bintang Timur', 1, 'Memerlukan konsultasi pemasaran', 2503006, '2025-09-08 20:20:12', 'Perusahaan', NULL),
(2505021, 'Jaka Lesmana', '081623456789', 'jaka.lesmana@gmail.com', 'Jl. Sultan Hasanuddin No. 34, RT 03/RW 01, Kelurahan Batu Putih, Kecamatan Baubau, Kota Baubau, Sulawesi Tenggara 93719', 'PT Samudra Jaya', 2, 'Klien dari event maritim', 2503007, '2025-09-08 20:22:27', 'Perusahaan', NULL),
(2505022, 'Kadek Wibowo', '082734567890', 'kadek.wibowo@outlook.com', 'Jl. Raya Padang Panjang No. 17, Nagari Batu Tabal, Kecamatan Tanah Datar, Kabupaten Tanah Datar, Sumatera Barat 27172', 'CV Alam Lestari', 1, 'Butuh pelatihan pertanian', 2503007, '2025-09-08 20:23:00', 'Perusahaan', NULL),
(2505023, 'Larasati Angga', '085845678901', 'larasati.angga@yahoo.com', 'Jl. Ahmad Yani No. 22, Komplek Perumahan Kaltim, Samarinda Ulu, Kota Samarinda, Kalimantan Timur 75123', 'PT Hijau Makmur', 1, 'Potensi proyek kehutanan', 2503007, '2025-09-08 20:23:32', 'Perusahaan', NULL),
(2505024, 'Mahardika Surya', '087956789012', 'mahardika.surya@hotmail.com', 'Jl. Raya Sentani No. 9, Kampung Harapan, Kecamatan Sentani, Kabupaten Jayapura, Papua 99351', 'PT Papua Cerdas', 2, 'Klien dari program CSR', 2503007, '2025-09-08 20:24:01', 'Perusahaan', NULL),
(2505025, 'Naufal Amarta', '089167890123', 'naufal.amarta@gmail.com', 'Jl. Pattimura No. 15, Kelurahan Tulehu, Kecamatan Salahutu, Kabupaten Maluku Tengah, Maluku 97581', 'CV Nusantara Laut', 1, 'Memerlukan konsultasi kelautan', 2503007, '2025-09-08 20:24:42', 'Perusahaan', NULL),
(2505026, 'Jeefri Gus Away', '085156118910', 'jefriaway@gmail.com', ' Jalan Mawar Indah No. 12  Desa: Desa Mekarsari  Kecamatan: Kecamatan Cipta Alam  Kota: Kabupaten Bandung  Provinsi: Jawa Barat  Kode Pos: 40123', '', 1, 'Peduli dengan kesehatan dan lingkungan, suka olahraga yoga, sering membaca artikel seputar gaya hidup sehat, dan lebih memilih produk alami atau organik.', 2503006, '2025-09-12 19:42:25', 'Pribadi', '');

-- --------------------------------------------------------

--
-- Struktur dari tabel `expert`
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
  `role` enum('Expert','Head of Expert') NOT NULL DEFAULT 'Expert'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `expert`
--

INSERT INTO `expert` (`idExpert`, `nmExpert`, `mobileExpert`, `emailExpert`, `password`, `idSkill`, `statExpert`, `Row`, `role`) VALUES
(2503001, 'Arian Willcox', '08957832654', 'willcockxx@outlook.com', '$2b$10$kT5eh7jHNBg5XLMLhzM29OrPU7xZAvVXB5K25VuNn3rVnVlBMyhZC', 9, NULL, NULL, 'Head of Expert'),
(2504004, 'Rima Ayu', '089585681402', 'arimakanayu@gmail.com', '$2b$10$K0noNs2NNMsFcfE7X0H2rOmWUV0mhvgsylWku8/0UIwOpJk9s1DK.', 6, NULL, NULL, 'Expert'),
(2504005, 'Kresna Saraswati', '08129421087', 'saraswatikresna@gmail.com', '$2b$10$KhCOIL/QsPmMmwRV6nfQSurqBXx2Tpnf3piyd2hHZe8MsIhQkvrdi', 10, NULL, NULL, 'Expert'),
(2504006, 'Yudha Pratama', '08128321592', 'yudhapratamaass18@gmail.com', '$2b$10$HUAJLd9Y3wQjcAtJ9jb8ueEklJfA1l8ND5XzZucHjFKbOxrx5QZni', 9, NULL, NULL, 'Expert'),
(2504007, 'Restu Ardianto', '08126754402', 'ardianto812@gmail.com', '$2b$10$Fk0bv7JQf.SMbyPpaoMzguPpmNMTDMed7x9gNsCk15ZRs0m1oaGSa', 2, NULL, NULL, 'Expert'),
(2504008, 'Kania Rahmawati', '08126932444', 'rahmakaniawati@gmail.com', '$2b$10$ckga.EmM0P1K7NCOyfYYSed8zPLM5QdVPDZlGN7NPau.rsReSyXu.', 5, NULL, NULL, 'Expert'),
(2510001, 'Harry Haryanto', '08957832655', 'harharyanto@gmail.com', '$2b$10$GlzpT7hgs5fwRErNfwyCCOD.K5.2MSvSsKVOXKu44eZnlNxl9Fw8W', 6, NULL, NULL, 'Head of Expert');

-- --------------------------------------------------------

--
-- Struktur dari tabel `opti`
--

CREATE TABLE `opti` (
  `idOpti` int(11) NOT NULL,
  `nmOpti` varchar(255) DEFAULT NULL,
  `contactOpti` varchar(255) DEFAULT NULL,
  `mobileOpti` varchar(20) DEFAULT NULL,
  `emailOpti` varchar(255) DEFAULT NULL,
  `statOpti` enum('Entry','Delivered','PO Received','Reject') DEFAULT 'Entry',
  `datePropOpti` date DEFAULT NULL,
  `idCustomer` int(11) DEFAULT NULL,
  `kebutuhan` text DEFAULT NULL,
  `idSumber` int(11) DEFAULT NULL,
  `idSales` int(11) NOT NULL,
  `jenisOpti` varchar(50) NOT NULL,
  `idExpert` int(11) DEFAULT NULL,
  `proposalOpti` varchar(255) DEFAULT NULL,
  `valOpti` int(11) DEFAULT NULL,
  `startProgram` datetime DEFAULT NULL,
  `endProgram` datetime DEFAULT NULL,
  `placeProgram` varchar(255) DEFAULT NULL,
  `idTypeTraining` int(11) DEFAULT NULL,
  `idTypeProject` int(11) DEFAULT NULL,
  `buktiPembayaran` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `opti`
--

INSERT INTO `opti` (`idOpti`, `nmOpti`, `contactOpti`, `mobileOpti`, `emailOpti`, `statOpti`, `datePropOpti`, `idCustomer`, `kebutuhan`, `idSumber`, `idSales`, `jenisOpti`, `idExpert`, `proposalOpti`, `valOpti`, `startProgram`, `endProgram`, `placeProgram`, `idTypeTraining`, `idTypeProject`, `buktiPembayaran`) VALUES
(2506001, 'Peningkatan Produktivitas Tim dari Klien Seminar', 'Heru Prasetyo', '08126032976', 'herprasetyo876@gmail.com', 'Entry', '2025-09-08', 2505001, 'Klien didapatkan dari seminar dan membutuhkan pelatihan untuk meningkatkan efisiensi kerja tim. Tindakan lanjut yang akan dilakukan adalah menjadwalkan pertemuan untuk presentasi proposal pada 15 September 2025.', 3, 2503003, 'Training', 2504005, '1757342287812.pdf', 50000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506002, 'Pelatihan Pengembangan SDM', 'Amara Putri', '08954327654', 'amaraputri@gmail.com', 'Entry', '2025-09-09', 2505002, 'Klien membutuhkan pelatihan SDM. Tindakan lanjut yang akan dilakukan adalah menjadwalkan sesi presentasi tentang modul pelatihan pada 20 September 2025.', 3, 2503003, 'Training', 2504005, '1757342521657.pdf', 35000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506003, 'Pelatihan Analisis Data & Strategi Bisnis', 'Jefri Ramadhan', '08126754097', 'jeefriramadhan@outlook.com', 'Entry', '2025-09-08', 2505004, 'Klien berasal dari website dan membutuhkan pelatihan analisis data. Tindakan lanjutnya adalah menghubungi klien untuk validasi kebutuhan pada 27 September 2025.', 1, 2503003, 'Training', 2504006, '1757342819083.pdf', 45000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506004, 'Pelatihan Digital Marketing', 'Roni Hartono', '08136784932', 'hartono3456@gmail.com', 'Entry', '2025-09-11', 2505007, 'Klien membutuhkan pelatihan online. Tindakan lanjut yang akan dilakukan adalah menjadwalkan sesi demo platform pelatihan online pada 22 September 2025.', 2, 2503004, 'Training', 2504006, '1757343283868.pdf', 40000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506005, 'Konsultasi Peningkatan Performa Aplikasi', 'Dimas Prakoso', '08126830980', 'dimaspraks@gmail.com', 'Entry', '2025-09-13', 2505009, ' Klien berasal dari referensi dan membutuhkan peningkatan performa aplikasi. Tindakan lanjutnya adalah menghubungi klien untuk validasi kebutuhan pada 26 September 2025.', 2, 2503004, 'Project', 2504007, '1757343605992.pdf', 60000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506006, 'Konsultasi Infrastruktur IT', 'Ratna Cahyani', '08126207645', 'ratnacahyani34@gmail.com', 'Entry', '2025-09-10', 2505008, 'Klien ini memiliki potensi kontrak besar. Tindakan lanjut yang akan dilakukan adalah follow-up untuk mendapatkan detail kebutuhan lebih lanjut pada 23 September 2025.', 1, 2503004, 'Project', 2504004, '1757343898329.pdf', 85000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506007, 'Pengembangan Aplikasi Web', 'Aldiansyah Putra', '08126754241', 'aldiputra@gmail.com', 'Entry', '2025-09-11', 2505006, 'Klien didapat dari pameran dan membutuhkan pengembangan aplikasi web. Tindakan lanjut yang akan dilakukan adalah pertemuan untuk presentasi detail proposal teknis pada 22 September 2025.', 3, 2503004, 'Project', 2504007, '1757344250702.pdf', 12000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506008, 'Pelatihan Teknologi & Data', 'Rania Salsabila', '08125678400', 'salsabillarania@gmail.com', 'Entry', '2025-09-08', 2505011, 'Klien didapat dari pameran teknologi. Tindakan lanjut yang akan dilakukan adalah menjadwalkan presentasi produk pada 1 Oktober 2025.', 2, 2503005, 'Training', 2504004, '1757344833684.pdf', 40000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506009, 'Pengembangan Aplikasi Web', 'Rangga Pranata', '081233335681', 'pranatarangga@gmail.com', 'Entry', '2025-09-11', 2505014, 'Klien didapat dari rekomendasi dan membutuhkan pengembangan aplikasi web. Tindakan lanjut yang akan dilakukan adalah pertemuan untuk presentasi detail proposal teknis pada 4 Oktober 2025.', 1, 2503005, 'Training', 2504007, '1757345070017.pdf', 120000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506010, 'Pelatihan Manajemen Proyek Agile', 'Ayunda Prameswari', '08138912666', 'prameswari12@gmail.com', 'Entry', '2025-09-11', 2505019, ' Klien berasal dari media sosial dan membutuhkan pelatihan. Tindakan lanjut yang akan dilakukan adalah menghubungi klien untuk validasi kebutuhan pada 15 Oktober 2025.', 2, 2503006, 'Training', 2504008, '1757345473483.pdf', 35000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506011, 'Proyek Sistem Informasi Maritim', 'Yoga Prasetya', '08126721000', 'prasetya47@gmail.com', 'Entry', '2025-09-11', 2505021, 'Klien ini memiliki potensi proyek sistem informasi. Tindakan lanjut yang akan dilakukan adalah follow-up untuk mendapatkan detail kebutuhan lebih lanjut pada 2 Oktober 2025.', 2, 2503007, 'Project', 2504007, '1757345711321.pdf', 150000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506012, 'Pelatihan Manajemen Program CSR', 'Wulan Ayu', '08125555732', 'wulanahayu@gmail.com', 'Entry', '2025-09-11', 2505024, 'Klien berasal dari program CSR dan membutuhkan pelatihan. Tindakan lanjut yang akan dilakukan adalah menghubungi klien untuk validasi kebutuhan pada 1 Oktober 2025.', 3, 2503007, 'Training', 2504008, '1757345880375.pdf', 25000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506013, 'Konsultasi Implementasi Teknologi AI', 'Marlina Fitri', '08127865321', 'fitrimarlina32@outlook.com', 'Entry', '2025-09-08', 2505003, 'Klien ini memiliki potensi proyek besar dan membutuhkan konsultasi teknologi. Tindakan lanjut yang akan dilakukan adalah follow-up untuk mendapatkan detail kebutuhan lebih lanjut pada 20 Oktober 2025.', 3, 2503003, 'Project', 2504007, '1757354358927.pdf', 150000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506014, 'Pelatihan Leadership', 'Arjuna Satria', '081547890123', 'arjuna.satria@gmail.com', 'Entry', '2025-09-10', 2505016, 'Klien ingin training di lakukan secara offline', 3, 2503006, 'Training', 2504005, '1757490374330.pdf', 40000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506015, 'Pelatihan AWS', 'Aditya Kusuma', '081298765432', 'aditya.kusuma@gmail.com', 'Entry', '2025-09-10', 2505001, 'Pelatihan AWS secara detail , praktek , dll. Di lakukan di kantor klien.', 3, 2503003, 'Training', 2504004, '1757492270359.pdf', 20000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506016, 'Pelatihan SCRUM', 'Citra Anggraini', '085789012345', 'citra.anggraini@yahoo.com', 'Entry', '2025-09-10', 2505018, 'Online Training tentang pelatihan SCRUM ,  klien akan mendapatkan gelar PRINCE', 3, 2503006, 'Training', 2510001, '1757493037332.pdf', 21000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506017, 'Maintenance Website Perusahaan', 'Diah Ayu', '089345678901', 'diah.ayu@gmail.com', 'Entry', '2025-09-10', 2505005, 'Klien ingin di upgrade website perusahaan nya. terutama perbaikan UI/UX', 1, 2503003, 'Project', 2504007, '1757493206480.pdf', 35000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506018, 'Pelatihan Leadership Online', 'Jaka Lesmana', '081623456789', 'jaka.lesmana@gmail.com', 'Entry', '2025-09-10', 2505021, 'Pelatihan Leadership via Zoom , info ruang tunggu klien. ', 2, 2503007, 'Training', 2504005, '1757494984000.pdf', 12000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506019, 'Konsulatasi Proses Bisnis Perusahaan', 'Indra Nugraha', '085612345678', 'indra.nugraha@yahoo.com', 'Entry', '2025-09-10', 2505008, 'Klien ingin kita membantu dalam merancang proses bisnis perusahaan mereka.', 3, 2503004, 'Project', 2504008, '1757496314678.pdf', 75000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506020, 'Pelatihan React JS', 'Candra Dharma', '082345678123', 'candra.dharma@outlook.com', 'Entry', '2025-09-10', 2505007, 'Pelatihan 4 hari secara online mengenai React JS.', 1, 2503004, 'Training', 2504007, '1757496482283.pdf', 40000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506021, 'Pelatihan Teknologi & Data', 'Kadek Wibowo', '082734567890', 'kadek.wibowo@outlook.com', 'Entry', '2025-09-10', 2505022, 'Zoom training', 1, 2503007, 'Training', 2510001, '1757501167748.pdf', 13000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506022, 'Konsultasi Peningkatan Performa Aplikasi', 'Diah Ayu', '089345678901', 'diah.ayu@gmail.com', 'Entry', '2025-09-10', 2505005, 'Lorem Ipsum Dolor Sir Amet', 3, 2503003, 'Project', 2510001, '1757505378839.pdf', 35000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506023, 'Pelatihan HRD ', 'Bagas Seno', '081276543210', 'bagas.seno@gmail.com', 'Entry', '2025-09-10', 2505006, 'Lorem Ipsum Dolor Sir Amet', 2, 2503004, 'Training', 2504005, '1757505553275.pdf', 12000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506024, 'Pelatihan Javascript', 'Niken Hartono', '085712345678', 'niken.hartono@yahoo.com', 'Entry', '2025-09-10', 2505013, 'Lorem Ipsum Dolor Sir Amet', 1, 2503005, 'Training', 2504006, '1757505725112.pdf', 16000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506025, 'Ujian Gelar PRINCE', 'Danar Pratama', '087890123456', 'danar.pratama@hotmail.com', 'Entry', '2025-09-10', 2505019, 'HANYA UNTUK MEREKA YANG SIAP UNTUK MENJADI MONARKI SEJATI.', 1, 2503006, 'Training', 2504004, '1757505968971.pdf', 120000000, NULL, NULL, NULL, NULL, NULL, NULL),
(2506026, 'Pelatihan Keselamatan Pekerja', 'Mahardika Surya', '087956789012', 'mahardika.surya@hotmail.com', 'Entry', '2025-09-10', 2505024, 'Lorem Ipsum Dolor Sir Amet', 3, 2503007, 'Training', 2510001, '1757506176605.pdf', 25000000, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------


--
-- Struktur dari tabel `outsource`
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
-- Struktur dari tabel `project`
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



-- --------------------------------------------------------

--
-- Struktur dari tabel `sales`
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
-- Dumping data untuk tabel `sales`
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
-- Struktur dari tabel `skill`
--

CREATE TABLE `skill` (
  `idSkill` int(11) NOT NULL,
  `nmSkill` varchar(255) DEFAULT NULL,
  `statSkill` varchar(100) DEFAULT NULL,
  `descSkill` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `skill`
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
-- Struktur dari tabel `statcustomer`
--

CREATE TABLE `statcustomer` (
  `idStatCustomer` int(11) NOT NULL,
  `nmStatCustomer` varchar(255) DEFAULT NULL,
  `descStatCustomer` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `statcustomer`
--

INSERT INTO `statcustomer` (`idStatCustomer`, `nmStatCustomer`, `descStatCustomer`) VALUES
(1, 'Review', 'Pending Customers (Review)'),
(2, 'Approved', 'Confirmed customer'),
(3, 'Reject', 'Rejecting Customers');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sumber`
--

CREATE TABLE `sumber` (
  `idSumber` int(11) NOT NULL,
  `nmSumber` varchar(255) DEFAULT NULL,
  `descSumber` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sumber`
--

INSERT INTO `sumber` (`idSumber`, `nmSumber`, `descSumber`) VALUES
(1, 'Website', 'Lead from company website'),
(2, 'Referral', 'Lead from customer referral'),
(3, 'Event', 'Lead from event or exhibition');

-- --------------------------------------------------------

--
-- Struktur dari tabel `training`
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
  `statusTraining` enum('Pending','On Progress','Finished') NOT NULL DEFAULT 'Pending',
  `fbTraining` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



-- --------------------------------------------------------

--
-- Struktur dari tabel `typeproject`
--

CREATE TABLE `typeproject` (
  `idTypeProject` int(11) NOT NULL,
  `nmTypeProject` varchar(255) DEFAULT NULL,
  `statTypeProject` varchar(100) DEFAULT NULL,
  `descTypeProject` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `typeproject`
--

INSERT INTO `typeproject` (`idTypeProject`, `nmTypeProject`, `statTypeProject`, `descTypeProject`) VALUES
(1, 'Default Project', NULL, NULL),
(2, 'Public Project', NULL, NULL),
(3, 'Inhouse Project', NULL, NULL),
(4, 'Online Project', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `typetraining`
--

CREATE TABLE `typetraining` (
  `idTypeTraining` int(11) NOT NULL,
  `nmTypeTraining` varchar(255) DEFAULT NULL,
  `statTypeTraining` varchar(100) DEFAULT NULL,
  `descTypeTraining` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `typetraining`
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
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`idAdmin`),
  ADD UNIQUE KEY `emailAdmin` (`emailAdmin`);

--
-- Indeks untuk tabel `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`idCustomer`),
  ADD KEY `idStatCustomer` (`idStatCustomer`),
  ADD KEY `idSales` (`idSales`);

--
-- Indeks untuk tabel `expert`
--
ALTER TABLE `expert`
  ADD PRIMARY KEY (`idExpert`),
  ADD KEY `idSkill` (`idSkill`);

--
-- Indeks untuk tabel `opti`
--
ALTER TABLE `opti`
  ADD PRIMARY KEY (`idOpti`),
  ADD KEY `idCustomer` (`idCustomer`),
  ADD KEY `idSumber` (`idSumber`),
  ADD KEY `idSales` (`idSales`),
  ADD KEY `idExpert` (`idExpert`),
  ADD KEY `idTypeTraining` (`idTypeTraining`),
  ADD KEY `idTypeProject` (`idTypeProject`);

--
-- Indeks untuk tabel `outsource`
--
ALTER TABLE `outsource`
  ADD PRIMARY KEY (`idOutsource`),
  ADD KEY `idSkill` (`idSkill`),
  ADD KEY `idCustomer` (`idCustomer`),
  ADD KEY `fk_outsource_opti_idx` (`idOpti`);

--
-- Indeks untuk tabel `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`idProject`),
  ADD KEY `idCustomer` (`idCustomer`),
  ADD KEY `idExpert` (`idExpert`),
  ADD KEY `fk_project_opti_idx` (`idOpti`),
  ADD KEY `fk_project_type` (`idTypeProject`);

--
-- Indeks untuk tabel `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`idSales`);

--
-- Indeks untuk tabel `skill`
--
ALTER TABLE `skill`
  ADD PRIMARY KEY (`idSkill`);

--
-- Indeks untuk tabel `statcustomer`
--
ALTER TABLE `statcustomer`
  ADD PRIMARY KEY (`idStatCustomer`);

--
-- Indeks untuk tabel `sumber`
--
ALTER TABLE `sumber`
  ADD PRIMARY KEY (`idSumber`);

--
-- Indeks untuk tabel `training`
--
ALTER TABLE `training`
  ADD PRIMARY KEY (`idTraining`),
  ADD KEY `idTypeTraining` (`idTypeTraining`),
  ADD KEY `idExpert` (`idExpert`),
  ADD KEY `idCustomer` (`idCustomer`),
  ADD KEY `fk_training_opti_idx` (`idOpti`);

--
-- Indeks untuk tabel `typeproject`
--
ALTER TABLE `typeproject`
  ADD PRIMARY KEY (`idTypeProject`);

--
-- Indeks untuk tabel `typetraining`
--
ALTER TABLE `typetraining`
  ADD PRIMARY KEY (`idTypeTraining`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admin`
--
ALTER TABLE `admin`
  MODIFY `idAdmin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2501005;

--
-- AUTO_INCREMENT untuk tabel `customer`
--
ALTER TABLE `customer`
  MODIFY `idCustomer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2505027;

--
-- AUTO_INCREMENT untuk tabel `expert`
--
ALTER TABLE `expert`
  MODIFY `idExpert` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2510002;

--
-- AUTO_INCREMENT untuk tabel `opti`
--
ALTER TABLE `opti`
  MODIFY `idOpti` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2506027;

--
-- AUTO_INCREMENT untuk tabel `outsource`
--
ALTER TABLE `outsource`
  MODIFY `idOutsource` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `project`
--
ALTER TABLE `project`
  MODIFY `idProject` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2508008;

--
-- AUTO_INCREMENT untuk tabel `sales`
--
ALTER TABLE `sales`
  MODIFY `idSales` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2503008;

--
-- AUTO_INCREMENT untuk tabel `skill`
--
ALTER TABLE `skill`
  MODIFY `idSkill` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `statcustomer`
--
ALTER TABLE `statcustomer`
  MODIFY `idStatCustomer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `sumber`
--
ALTER TABLE `sumber`
  MODIFY `idSumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `training`
--
ALTER TABLE `training`
  MODIFY `idTraining` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2507014;

--
-- AUTO_INCREMENT untuk tabel `typeproject`
--
ALTER TABLE `typeproject`
  MODIFY `idTypeProject` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `typetraining`
--
ALTER TABLE `typetraining`
  MODIFY `idTypeTraining` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`idStatCustomer`) REFERENCES `statcustomer` (`idStatCustomer`),
  ADD CONSTRAINT `customer_ibfk_2` FOREIGN KEY (`idSales`) REFERENCES `sales` (`idSales`);

--
-- Ketidakleluasaan untuk tabel `expert`
--
ALTER TABLE `expert`
  ADD CONSTRAINT `expert_ibfk_1` FOREIGN KEY (`idSkill`) REFERENCES `skill` (`idSkill`);

--
-- Ketidakleluasaan untuk tabel `opti`
--
ALTER TABLE `opti`
  ADD CONSTRAINT `opti_ibfk_1` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`),
  ADD CONSTRAINT `opti_ibfk_2` FOREIGN KEY (`idSumber`) REFERENCES `sumber` (`idSumber`),
  ADD CONSTRAINT `opti_ibfk_3` FOREIGN KEY (`idSales`) REFERENCES `sales` (`idSales`),
  ADD CONSTRAINT `opti_ibfk_4` FOREIGN KEY (`idExpert`) REFERENCES `expert` (`idExpert`),
  ADD CONSTRAINT `opti_ibfk_5` FOREIGN KEY (`idTypeTraining`) REFERENCES `typetraining` (`idTypeTraining`),
  ADD CONSTRAINT `opti_ibfk_6` FOREIGN KEY (`idTypeProject`) REFERENCES `typeproject` (`idTypeProject`);

--
-- Ketidakleluasaan untuk tabel `outsource`
--
ALTER TABLE `outsource`
  ADD CONSTRAINT `fk_outsource_opti` FOREIGN KEY (`idOpti`) REFERENCES `opti` (`idOpti`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `outsource_ibfk_1` FOREIGN KEY (`idSkill`) REFERENCES `skill` (`idSkill`),
  ADD CONSTRAINT `outsource_ibfk_2` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`);

--
-- Ketidakleluasaan untuk tabel `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `fk_project_opti` FOREIGN KEY (`idOpti`) REFERENCES `opti` (`idOpti`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_project_type` FOREIGN KEY (`idTypeProject`) REFERENCES `typeproject` (`idTypeProject`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `project_ibfk_1` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`),
  ADD CONSTRAINT `project_ibfk_3` FOREIGN KEY (`idExpert`) REFERENCES `expert` (`idExpert`);

--
-- Ketidakleluasaan untuk tabel `training`
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