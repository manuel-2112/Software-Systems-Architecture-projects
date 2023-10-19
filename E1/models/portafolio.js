const Sequelize = require('sequelize');
const db = require('../util/database');
const PortfolioItem = require('./itemportafolio'); // Importa el modelo de PortfolioItem

const Portafolio = db.define('portafolio', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userid: {
    type: Sequelize.STRING,
  },
});

// Establece la relación uno a muchos: un Portafolio puede tener varios PortfolioItem
Portafolio.hasMany(PortfolioItem, { as: 'items', foreignKey: 'portafolioId' });

// Establece la relación de pertenencia: un PortfolioItem pertenece a un único Portafolio
PortfolioItem.belongsTo(Portafolio, { foreignKey: 'portafolioId' });

module.exports = Portafolio;
