const PortfolioItem = require('../models/itemportafolio');

// crear un get del portafolio
exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await PortfolioItem.findAll();
    return res.status(200).json(portfolios);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los portafolios' });
  }
};
