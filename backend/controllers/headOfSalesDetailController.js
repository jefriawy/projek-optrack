// backend/controllers/headOfSalesDetailController.js
const pool = require('../config/database');

exports.getSalesDetail = async (req, res) => {
  const { salesId } = req.params;

  try {
    // This logic is replicated from getSalesDashboardData in optiController.js
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

    const [monthlyData] = await pool.query(
      `${performanceQueryBody} WHERE won_deals.idSales = ? GROUP BY month ORDER BY month ASC`,
      [salesId]
    );

    const salesInfoQuery = `SELECT s.nmSales, COUNT(o.idOpti) as totalOpportunities, COUNT(DISTINCT o.idCustomer) as totalCustomers
       FROM sales s
       LEFT JOIN opti o ON s.idSales = o.idSales AND o.statOpti = 'po received'
       WHERE s.idSales = ?
       GROUP BY s.idSales`;
       
    const [salesInfo] = await pool.query(salesInfoQuery, [salesId]);

    const info = salesInfo[0] || { nmSales: '', totalOpportunities: 0, totalCustomers: 0 };

    res.json({
      monthlyPerformance: monthlyData,
      totalOpportunities: info.totalOpportunities,
      totalCustomers: info.totalCustomers,
      salesName: info.nmSales,
    });
  } catch (error) {
    console.error('Error fetching sales detail:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
