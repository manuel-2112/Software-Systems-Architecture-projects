const express = require('express');

const router = express.Router();
const portafolioController = require('../controllers/portafolio');

// Ruta POST
router.post('/comprar-accion', portafolioController.buyStock);

// Ruta GET
router.get('/portafolio', portafolioController.getAllPortfolios);

// post para obtener la informacion del portafolio
router.post('/obtener-portafolio', portafolioController.obtainPortafolio);

module.exports = router;
