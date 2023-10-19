const Sequelize = require('sequelize');
const db = require('../util/database');

const Stock = db.define('stock', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  symbol: Sequelize.STRING,
  shortName: Sequelize.STRING,
  price: Sequelize.STRING,
  currency: Sequelize.STRING,
  source: Sequelize.STRING,
});

module.exports = Stock;
