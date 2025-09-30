const projectModel = require('../models/projectModel');

exports.getSalesDetail = async (req, res) => {
  const { salesId } = req.params;
  try {
    const opportunities = await projectModel.getProjectsBySalesId(salesId);
    const filteredOpportunities = opportunities.filter(opp => opp.status === 'po received');

    const monthlyPerformance = {};
    filteredOpportunities.forEach(opp => {
      const month = new Date(opp.createdAt).toLocaleString('default', { month: 'long' });
      if (!monthlyPerformance[month]) {
        monthlyPerformance[month] = 0;
      }
      monthlyPerformance[month] += opp.valOpti;
    });

    res.json({
      monthlyPerformance,
      totalCustomers: opportunities.length,
    });
  } catch (error) {
    console.error('Error fetching sales detail:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
