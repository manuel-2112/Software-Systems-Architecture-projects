// portfolioController.js
const Portafolio = require('../models/portafolio');
const PortfolioItem = require('../models/itemportafolio');
const Buylist = require('../models/buylist');
const Wallet = require('../models/wallet');

exports.buyStock = async (req, res) => {
  try {
    const { request_id } = req.body;
    const { valid } = req.body;

    const buylist = await Buylist.findOne({ where: { requestid: request_id } });
    const wallet = await Wallet.findOne({ where: { userId: buylist.userid } });

    if (valid) {
      // actualizar el saldo de la billetera
      wallet.balance -= buylist.price;
      await wallet.save();
      const portfolio = await Portafolio.findOne({ where: { userid: buylist.userid } });
      // cambiar el estado de la buylist a aprobado
      buylist.estado = 'aprobado';
      await buylist.save();

      if (!portfolio) {
        const newPortfolio = await Portafolio.create({ userid: buylist.userid });
        const portfolioItem = await PortfolioItem.create({ symbol: buylist.symbol, amount: buylist.amount, portafolioId: newPortfolio.id });
        return res.status(201).json(newPortfolio);
      }

      const portfolioItem = await PortfolioItem.create({ symbol: buylist.symbol, amount: buylist.amount, portafolioId: portfolio.id });
      return res.status(201).json(portfolio);
    }
    // cambiar el estado del buylist a invalido
    buylist.estado = 'rechazado';
    await buylist.save();
  } catch (error) {
    return res.status(500).json({ error: 'Error al realizar la compra' });
  }
};

exports.getPortafolioInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    let portfolio = await Portfolio.findOne({ where: { userId } });

    if (!portfolio) {
      // Si el portafolio no existe, créalo automáticamente.
      portfolio = await Portfolio.create({ userId });
    }

    const portfolioItems = await PortfolioItem.findAll({ where: { portfolioId: portfolio.id } });

    const portafolioInfo = {
      portfolio,
      portfolioItems,
    };

    return res.status(200).json(portafolioInfo);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener la información del portafolio' });
  }
};
// get all portfolios
exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portafolio.findAll();
    return res.status(200).json(portfolios);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los portafolios' });
  }
};

// post para obtener portafolio y itemportafolio del user id dado
exports.obtainPortafolio = async (req, res) => {
  const { userId } = req.body;
  try {
    const portfolio = await Portafolio.findOne({ where: { userid: userId } });
    const portfolioItems = await PortfolioItem.findAll({ where: { portafolioId: portfolio.id } });
    const portafolioInfo = {
      portfolio,
      portfolioItems,
    };
    return res.status(200).json(portafolioInfo);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el portafolio' });
  }
};
