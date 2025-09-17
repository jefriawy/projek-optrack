const pool = require("../config/database");
const bcrypt = require("bcrypt");

const Akademik = {
  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM akademik WHERE emailAkademik = ?", [email]);
    return rows[0];
  },

  async create({ nmAkademik, emailAkademik, password, mobileAkademik, idAkademik }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO akademik (idAkademik, nmAkademik, emailAkademik, password, mobileAkademik) VALUES (?, ?, ?, ?, ?)",
      [idAkademik, nmAkademik, emailAkademik, hashedPassword, mobileAkademik || null]
    );
    return result[0];
  },
};

module.exports = Akademik;
