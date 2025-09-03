// backend/controllers/headSalesController.js
const pool = require("../config/database");

// Head of Sales: lihat agregat SELURUH data (tanpa idHeadSales)
const getHeadSalesDashboardData = async (req, res) => {
  try {
    const { role } = req.user || {};
    if (!["Head Sales", "Admin"].includes(role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // 1) Pipeline per status
    const pipelineQ = pool.query(`
      SELECT o.statOpti AS statOpti, COUNT(*) AS count
      FROM opti o
      GROUP BY o.statOpti
      ORDER BY count DESC
    `);

    // 2) Customer per sales (leaderboard)
    const custPerSalesQ = pool.query(`
      SELECT s.nmSales AS name, COUNT(c.idCustomer) AS customers
      FROM sales s
      LEFT JOIN customer c ON c.idSales = s.idSales
      GROUP BY s.idSales, s.nmSales
      ORDER BY customers DESC
    `);

    // 3) Opportunity types
    const typesQ = pool.query(`
      SELECT o.jenisOpti AS jenisOpti, COUNT(*) AS count
      FROM opti o
      GROUP BY o.jenisOpti
      ORDER BY count DESC
    `);

    // 4) Monthly performance (anggap "Succed" = closed-won)
    const perfQ = pool.query(`
      SELECT DATE_FORMAT(o.datePropOpti, '%Y-%m-01') AS month,
             SUM(COALESCE(o.kebutuhan, 0)) AS totalValue
      FROM opti o
      WHERE o.statOpti = 'Succed'
      GROUP BY month
      ORDER BY month ASC
    `);

    // 5) Top 5 open deals (bukan closed)
    const topDealsQ = pool.query(`
      SELECT o.nmOpti, c.corpCustomer, o.kebutuhan
      FROM opti o
      LEFT JOIN customer c ON c.idCustomer = o.idCustomer
      WHERE o.statOpti NOT IN ('Closed Won', 'Closed Lost', 'Succed')
      ORDER BY COALESCE(o.kebutuhan, 0) DESC
      LIMIT 5
    `);

    const [
      [pipelineStats],
      [salesRepCustomers],
      [opportunityTypes],
      [performanceOverTime],
      [topOpenDeals],
    ] = await Promise.all([pipelineQ, custPerSalesQ, typesQ, perfQ, topDealsQ]);

    res.json({
      pipelineStats,
      salesRepCustomers,
      opportunityTypes,
      performanceOverTime,
      topOpenDeals,
    });
  } catch (err) {
    console.error("Head Sales dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getHeadSalesDashboardData };
