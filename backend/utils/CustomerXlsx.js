// backend/utils/CustomerXlsx.js
const xlsx = require('xlsx');

/**
 * Membuat buffer file XLSX dari array data JSON.
 * @param {Array<Object>} data - Array objek yang akan diekspor.
 * @param {Array<string>} columns - Array berisi nama-nama kolom yang akan diekspor.
 * @param {string} sheetName - Nama untuk worksheet.
 * @returns {Buffer} - Buffer berisi data file XLSX.
 */
function exportToXlsx(data, columns, sheetName = 'Sheet1') {
  // 1. Filter dan urutkan data sesuai kolom yang diminta
  const filteredData = data.map(item => {
    const row = {};
    columns.forEach(col => {
      row[col] = item[col] !== undefined ? item[col] : null;
    });
    return row;
  });

  // 2. Buat worksheet dari data yang sudah difilter
  const worksheet = xlsx.utils.json_to_sheet(filteredData, { header: columns });
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

  // 3. Hasilkan buffer file
  return xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
}

module.exports = { exportToXlsx };