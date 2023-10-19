const Sequelize = require('sequelize');
const db = require('../util/database');

const PortfolioItem = db.define('portfolioItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  symbol: {
    type: Sequelize.STRING,
  },
  amount: {
    type: Sequelize.INTEGER,
  },
});

module.exports = PortfolioItem;
