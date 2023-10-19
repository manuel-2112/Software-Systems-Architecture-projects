const express = require('express');

const router = express.Router();
const portfolioItemController = require('../controllers/itemportafolio');

// Ruta para crear obtener todos los items de portafolio
router.get('/', portfolioItemController.getAllPortfolios);

module.exports = router;
