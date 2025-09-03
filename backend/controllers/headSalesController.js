// backend/controllers/headSalesController.js
const pool = require("../config/database");

// Head of Sales: agregat seluruh data (tanpa idHeadSales)
const getHeadSalesDashboardData = async (req, res) => {
  try {
    const { role } = req.user || {};
    if (!["Head Sales", "Admin"].includes(role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // === KPI yang diminta (3 kotak) ===
    const totalSalesQ = pool.query(`
      SELECT COUNT(*) AS totalSales
      FROM sales
      WHERE role = 'Sales'
    `);

    const totalCustomersQ = pool.query(`
      SELECT COUNT(*) AS totalCustomers
      FROM customer
    `);

    const totalOptiQ = pool.query(`
      SELECT COUNT(*) AS totalOpti
      FROM opti
    `);

    // === Charts yang sudah ada ===
    const pipelineQ = pool.query(`
      SELECT o.statOpti AS statOpti, COUNT(*) AS count
      FROM opti o
      GROUP BY o.statOpti
      ORDER BY count DESC
    `);

    const customersPerSalesQ = pool.query(`
      SELECT s.nmSales AS name, COUNT(c.idCustomer) AS customers
      FROM sales s
      LEFT JOIN customer c ON c.idSales = s.idSales
      GROUP BY s.idSales, s.nmSales
      ORDER BY customers DESC
    `);

    const typesQ = pool.query(`
      SELECT o.jenisOpti AS jenisOpti, COUNT(*) AS count
      FROM opti o
      GROUP BY o.jenisOpti
      ORDER BY count DESC
    `);

    // anggap 'Succed' = closed-won (samakan dengan data kamu)
    const perfQ = pool.query(`
      SELECT DATE_FORMAT(o.datePropOpti, '%Y-%m-01') AS month,
             SUM(COALESCE(o.kebutuhan, 0)) AS totalValue
      FROM opti o
      WHERE o.statOpti = 'Succed'
      GROUP BY month
      ORDER BY month ASC
    `);

    const topDealsQ = pool.query(`
      SELECT o.nmOpti, c.corpCustomer, o.kebutuhan
      FROM opti o
      LEFT JOIN customer c ON c.idCustomer = o.idCustomer
      WHERE o.statOpti NOT IN ('Closed Won','Closed Lost','Succed')
      ORDER BY COALESCE(o.kebutuhan, 0) DESC
      LIMIT 5
    `);

    const [
      [salesRow],
      [custRow],
      [optiRow],
      [pipelineStats],
      [salesRepCustomers],
      [opportunityTypes],
      [performanceOverTime],
      [topOpenDeals],
    ] = await Promise.all([
      totalSalesQ,
      totalCustomersQ,
      totalOptiQ,
      pipelineQ,
      customersPerSalesQ,
      typesQ,
      perfQ,
      topDealsQ,
    ]);

    res.json({
      kpis: {
        totalSales: salesRow[0]?.totalSales ?? 0,
        totalCustomers: custRow[0]?.totalCustomers ?? 0,
        totalOpti: optiRow[0]?.totalOpti ?? 0,
      },
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
