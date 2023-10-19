const Buylist = require('../models/buylist');

// Controlador para obtener todas las compras
exports.getAllBuylists = async (req, res, next) => {
  try {
    const buylists = await Buylist.findAll();
    res.status(200).json(buylists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las compras.' });
  }
};

// Controlador para crear una nueva compra
exports.createBuylist = async (req, res, next) => {
  try {
    const { userid, requestid } = req.body;

    const newBuylist = await Buylist.create({ userid, requestid });

    res.status(201).json(newBuylist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la compra.' });
  }
};

// Controlador para obtener los buylists de un usuario
exports.getBuylistsByUser = async (req, res, next) => {
  try {
    const { userid } = req.params;

    const buylists = await Buylist.findAll({ where: { userid } });

    res.status(200).json(buylists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las compras.' });
  }
};
