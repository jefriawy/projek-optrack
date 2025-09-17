// file: backend/utils/idGenerator.js

const pool = require("../config/database");

// Mapping dari role ke kode numerik (HC dan Trainer dihapus)
const roleToCode = {
  Admin: "01",
  "Head Sales": "02",
  Sales: "03",
  Expert: "04",
  Akademik: "11",
  PM: "12",
  
  Customer: "05",
  Opti: "06",
  Training: "07",
  Project: "08",
  Outsource: "09",
};

// Mapping dari role ke informasi tabel
const roleToTableInfo = {
  Admin: { tableName: "admin", idColumn: "idAdmin" },
  "Head Sales": { tableName: "sales", idColumn: "idSales" },
  Sales: { tableName: "sales", idColumn: "idSales" },
  Expert: { tableName: "expert", idColumn: "idExpert" },
  Akademik: { tableName: "akademik", idColumn: "idAkademik" },
  PM: { tableName: "pm", idColumn: "idPM" },
  
  Customer: { tableName: "customer", idColumn: "idCustomer" },
  Opti: { tableName: "opti", idColumn: "idOpti" },
  Training: { tableName: "training", idColumn: "idTraining" },
  Project: { tableName: "project", idColumn: "idProject" },
  Outsource: { tableName: "outsource", idColumn: "idOutsource" },
};

// Mapping dari jenis file ke kode numerik
const fileTypeToCode = {
  proposalOpti: "10",
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

  const tableInfo = roleToTableInfo[role];
  if (!tableInfo) {
    throw new Error(`Invalid table info for role: ${role}`);
  }

  const { tableName, idColumn } = tableInfo;
  const prefix = `${year}${roleCode}`;

  const query = `SELECT ${idColumn} FROM ${tableName} WHERE CAST(${idColumn} AS CHAR) LIKE ?
  ORDER BY CAST(SUBSTRING(CAST(${idColumn} AS CHAR), 5) AS UNSIGNED) DESC LIMIT 1`;

  const [rows] = await pool.query(query, [`${prefix}%`]);

  let increment = 1;
  if (rows.length > 0 && rows[0][idColumn]) {
    const lastId = rows[0][idColumn].toString();
    const lastIncrement = parseInt(lastId.slice(-3), 10);
    increment = lastIncrement + 1;
  }

  const paddedIncrement = increment.toString().padStart(3, "0");
  // return string to preserve leading zeros and allow VARCHAR id columns
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
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const fileCode = fileTypeToCode[fileType];
  if (!fileCode) {
    throw new Error(`Invalid file type for ID generation: ${fileType}`);
  }

  const prefix = `${year}${month}${fileCode}`;
  const query = `SELECT proposalOpti FROM opti WHERE proposalOpti LIKE ?
  ORDER BY proposalOpti DESC LIMIT 1`;

  const [rows] = await pool.query(query, [`${prefix}%`]);

  let increment = 1;
  if (rows.length > 0) {
    const lastId = rows[0].proposalOpti;
    if (lastId) {
      const lastIncrement = parseInt(lastId.slice(-3), 10);
      increment = lastIncrement + 1;
    }
  }

  const paddedIncrement = increment.toString().padStart(3, "0");
  return `${prefix}${paddedIncrement}`;
}

module.exports = { generateUserId, generateFileId };