const pool = require('../config/database');

// Mapping dari role ke kode numerik
const roleToCode = {
  'Admin': '01',
  'Head Sales': '02',
  'Sales': '03',
  'Expert': '04',
  'HC': '05',
  'Trainer': '06',
};

// Mapping dari jenis file ke kode numerik
const fileTypeToCode = {
  'proposalOpti': '10',
};

/**
 * Membuat ID Pengguna yang terstruktur.
 * Format: (Tahun2Digit)(KodeJabatan2Digit)(NomorUrut3Digit)
 * @param {string} role - Role pengguna (e.g., 'Admin', 'Sales').
 * @returns {Promise<string>} ID pengguna yang baru.
 */
async function generateUserId(role) {
  const year = new Date().getFullYear().toString().slice(-2);
  const roleCode = roleToCode[role];
  if (!roleCode) {
    throw new Error(`Invalid role for ID generation: ${role}`);
  }

  const prefix = `${year}${roleCode}`;
  const query = `SELECT id FROM users WHERE id LIKE ? ORDER BY CAST(SUBSTRING(id, -3) AS UNSIGNED) DESC LIMIT 1`;
  
  const [rows] = await pool.query(query, [`${prefix}%`]);

  let increment = 1;
  if (rows.length > 0 && rows[0].id && typeof rows[0].id === 'string') {
    const lastId = rows[0].id;
    // Mengambil 3 digit terakhir sebagai nomor urut
    const lastIncrement = parseInt(lastId.slice(-3), 10);
    increment = lastIncrement + 1;
  }

  const paddedIncrement = increment.toString().padStart(3, '0');
  return `${prefix}${paddedIncrement}`;
}

/**
 * Membuat ID untuk file attachment yang terstruktur.
 * Format: (Tahun2Digit)(Bulan2Digit)(KodeJenisFile2Digit)(NomorUrut3Digit)
 * @param {string} fileType - Jenis file (e.g., 'proposalOpti').
 * @returns {Promise<string>} ID file yang baru.
 */
async function generateFileId(fileType) {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const fileCode = fileTypeToCode[fileType];

  if (!fileCode) {
    throw new Error(`Invalid file type for ID generation: ${fileType}`);
  }

  const prefix = `${year}${month}${fileCode}`;
  // Mencari ID terakhir di kolom 'proposalOpti' pada tabel 'opti'
  const query = `SELECT proposalOpti FROM opti WHERE proposalOpti LIKE ? ORDER BY proposalOpti DESC LIMIT 1`;
  
  const [rows] = await pool.query(query, [`${prefix}%`]);

  let increment = 1;
  if (rows.length > 0) {
    const lastId = rows[0].proposalOpti;
    if (lastId) {
        // Mengambil 3 digit terakhir sebagai nomor urut
        const lastIncrement = parseInt(lastId.slice(-3), 10);
        increment = lastIncrement + 1;
    }
  }

  const paddedIncrement = increment.toString().padStart(3, '0');
  return `${prefix}${paddedIncrement}`;
}


module.exports = { generateUserId, generateFileId };
