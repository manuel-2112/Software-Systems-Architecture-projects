const router = require('express').Router();
const stockController = require('../controllers/stocks'); // Import the stock controller

// CRUD Routes /stocks
router.get('/', stockController.getStocks); // /stocks
router.get('/latest', stockController.getLatestStocks);
router.get('/:stockSymbol', stockController.getStockHistory);// stocks/:stockSymbol
router.post('/', stockController.createStock); // /stocks
router.put('/:stockSymbol', stockController.updateStock); // /stocks/:stockSymbol
router.delete('/:stockSymbol', stockController.deleteStock); // /stocks/:stockSymbol

module.exports = router;
