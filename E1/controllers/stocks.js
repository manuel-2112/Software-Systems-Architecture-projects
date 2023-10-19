const Sequelize = require('sequelize');
const Stock = require('../models/stock'); // Import the Stock model

// CRUD Controllers

// Get all stocks
exports.getStocks = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Página por defecto es 1
  const size = parseInt(req.query.size) || 25; // Tamaño por defecto es 25
  const offset = (page - 1) * size;
  try {
    const stocks = await Stock.findAll({
      offset,
      limit: size,
      order: [['createdAt', 'DESC']],
    });

    if (!stocks.length) {
      return res.status(404).json({ error: 'There are no stocks' });
    }
    res.status(200).json({ stocks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error retrieving stocks' });
  }
};

// Get latest stock information for each symbol
exports.getLatestStocks = (req, res, next) => {
  Stock.findAll({
    attributes: [
      'symbol',
      [Sequelize.fn('max', Sequelize.col('shortName')), 'shortName'],
      [Sequelize.fn('max', Sequelize.col('price')), 'latest_price'],
      [Sequelize.fn('max', Sequelize.col('currency')), 'currency'],
      [Sequelize.fn('max', Sequelize.col('source')), 'source'],
      [Sequelize.fn('max', Sequelize.col('createdAt')), 'latest_created_at'],
    ],
    group: ['symbol'],
  })
    .then((stocks) => {
      res.status(200).json({ latestStocks: stocks });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Error retrieving latest stocks' });
    });
};

exports.getStockHistory = async (req, res, next) => {
  const symbol = req.params.stockSymbol;
  const page = parseInt(req.query.page) || 1; // Página por defecto es 1
  const size = parseInt(req.query.size) || 25; // Tamaño por defecto es 25
  const offset = (page - 1) * size;
  try {
    const stocks = await Stock.findAll({
      where: {
        symbol,
      },
      offset,
      limit: size,
      order: [['createdAt', 'DESC']],
    });

    if (!stocks.length) {
      // Si el resultado está vacío, responde con un error 404
      return res.status(404).json({ error: 'Stock symbol not found' });
    }
    res.status(200).json({ stocks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error retrieving stock history' });
  }
};

// Create stock
exports.createStock = (req, res, next) => {
  const { symbol } = req.body;
  const { shortName } = req.body;
  const { price } = req.body;
  const { currency } = req.body;
  const { source } = req.body;
  Stock.create({
    symbol,
    shortName,
    price,
    currency,
    source,
  })
    .then((result) => {
      console.log('Created Stock');
      res.status(201).json({
        message: 'Stock created successfully!',
        stock: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Error creating stock' });
    });
};

// Update stock
exports.updateStock = (req, res, next) => {
  const { stockSymbol } = req.params;
  const updatedShortName = req.body.shortName;
  const updatedPrice = req.body.price;
  Stock.findOne({
    where: { symbol: stockSymbol },
  })
    .then((stock) => {
      if (!stock) {
        return res.status(404).json({ message: 'Stock not found!' });
      }
      stock.shortName = updatedShortName;
      stock.price = updatedPrice;
      return stock.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Stock updated!', stock: result });
    })
    .catch((err) => console.log(err));
};

// Delete stock
exports.deleteStock = (req, res, next) => {
  const { stockSymbol } = req.params;
  Stock.findOne({
    where: { symbol: stockSymbol },
  })
    .then((stock) => {
      if (!stock) {
        return res.status(404).json({ message: 'Stock not found!' });
      }
      return stock.destroy();
    })
    .then((result) => {
      res.status(200).json({ message: 'Stock deleted!' });
    })
    .catch((err) => console.log(err));
};
