const express = require('express');
const walletController = require('../controllers/wallet');

const router = express.Router();

// Ruta protegida: cargar dinero en la billetera
router.post('/load-money', walletController.loadMoney);
router.post('/buy-stock', walletController.buyStock);

// ruta para buscar wallet de usuario o crear una en caso de que no exista
router.post('/findwallet', walletController.findOrCreate);

// ruta para obtener todas las wallets
router.get('/', walletController.getWallets);

// ruta para eliminar todas las wallets
router.get('/deleteall', walletController.deleteAll);

module.exports = router;
