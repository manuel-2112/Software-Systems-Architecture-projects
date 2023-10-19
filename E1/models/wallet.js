const Sequelize = require('sequelize');
const db = require('../util/database');

const Wallet = db.define('wallet', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  balance: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0, // Validación para que balance no sea negativo
    },
  },
});

module.exports = Wallet;
