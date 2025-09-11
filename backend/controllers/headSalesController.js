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
    const performanceQueryBody = `
      SELECT
        DATE_FORMAT(won_deals.start_date, '%Y-%m') AS month,
        SUM(won_deals.value) AS totalValue
      FROM (
        SELECT p.startProject AS start_date, o.valOpti AS value, o.idSales FROM project p JOIN opti o ON p.idOpti = o.idOpti WHERE p.startProject IS NOT NULL
        UNION ALL
        SELECT t.startTraining AS start_date, o.valOpti AS value, o.idSales FROM training t JOIN opti o ON t.idOpti = o.idOpti WHERE t.startTraining IS NOT NULL
      ) AS won_deals
    `;

    const perfQ = pool.query(`${performanceQueryBody} GROUP BY month ORDER BY month ASC`);

    const topWonDealsQ = pool.query(`
      SELECT
        won_deals.name AS nmOpti,
        won_deals.customer AS corpCustomer,
        won_deals.value AS valOpti
      FROM (
        SELECT p.nmProject AS name, c.corpCustomer AS customer, o.valOpti AS value, o.idSales
        FROM project p
        JOIN opti o ON p.idOpti = o.idOpti
        JOIN customer c ON p.idCustomer = c.idCustomer

        UNION ALL

        SELECT t.nmTraining AS name, c.corpCustomer AS customer, o.valOpti AS value, o.idSales
        FROM training t
        JOIN opti o ON t.idOpti = o.idOpti
        JOIN customer c ON t.idCustomer = c.idCustomer
      ) AS won_deals
      ORDER BY won_deals.value DESC
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
      [topWonDeals],
    ] = await Promise.all([
      totalSalesQ,
      totalCustomersQ,
      totalOptiQ,
      pipelineQ,
      customersPerSalesQ,
      typesQ,
      perfQ,
      topWonDealsQ,
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
      topWonDeals,
    });
  } catch (err) {
    console.error("Head Sales dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getHeadSalesDashboardData };