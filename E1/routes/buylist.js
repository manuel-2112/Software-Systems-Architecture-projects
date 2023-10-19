const express = require('express');

const router = express.Router();
const buylistController = require('../controllers/buylist');

// Ruta para obtener todas las compras
router.get('/buylist', buylistController.getAllBuylists);

// Ruta para crear una nueva compra
router.post('/buylist', buylistController.createBuylist);

// Ruta para obtener las compras de un usuario
router.get('/:userid', buylistController.getBuylistsByUser);

module.exports = router;
