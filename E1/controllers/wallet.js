const { v4: uuidv4 } = require('uuid');

const path = require('path');
const Wallet = require('../models/wallet');
const Stock = require('../models/stock');
const { sendRequest } = require('../util/mqtt-stock-request');
const Buylist = require('../models/buylist');

// Cargar dinero en la billetera virtual
exports.loadMoney = async (req, res, next) => {
  try {
    const { userId } = req.body; // Obtén el ID de usuario desde el token de autenticación
    let { amount } = req.body;

    // Convert the amount to a float
    amount = parseFloat(amount);

    // Validación básica (puedes agregar más validaciones)
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0.' });
    }

    const userWallet = await Wallet.findOne({ where: { userId } });

    if (!userWallet) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Convert userWallet.balance to a number before adding
    const balance = parseFloat(userWallet.balance);
    const newBalance = balance + amount;

    // Actualizar el saldo de la billetera

    userWallet.balance = newBalance;

    await userWallet.save();

    res.status(200).json({ message: 'The balance has been updated successfully.', newBalance: userWallet.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error when loading money in the wallet.' });
  }
};

exports.buyStock = async (req, res, next) => {
  try {
    const { userId } = req.body; // Obtén el ID de usuario desde el token de autenticación
    const { stockSymbol } = req.body;
    const { amount } = req.body;
    // Importa la librería

    // Obtén la dirección IP del cliente
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Importa la librería geoip-lite para obtener la ubicación basada en la IP
    const geoip = require('geoip-lite');
    const geo = geoip.lookup(ip);

    console.log('IP:', ip);
    console.log('Ubicación:', geo);

    const userWallet = await Wallet.findOne({ where: { userId } });
    const stock = await Stock.findOne({
      where: { symbol: stockSymbol },
      order: [['createdAt', 'DESC']],
    });

    const finalPrice = parseInt(stock.price) * parseInt(amount);
    const uuid = uuidv4();
    const currentDatetime = new Date().toISOString();
    const newBuylist = await Buylist.create({
      userid: userId, requestid: uuid, symbol: stockSymbol, amount, estado: 'pendiente', price: finalPrice,
    });

    if (userWallet.balance < finalPrice) {
      return res.status(400).json({ message: 'Insufficient funds.' });
    }

    sendRequest({
      request_id: uuid,
      group_id: '30',
      symbol: stockSymbol,
      datetime: currentDatetime,
      deposit_token: '',
      quantity: amount,
      seller: 0,
    });

    res.status(200).json({ message: 'The stock purchase was sent.', newBalance: userWallet.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending purchase.' });
  }
};

// Buscar o crear una wallet para el usuario
exports.findOrCreate = async (req, res, next) => {
  try {
    const { userId } = req.body; // Obtén el ID de usuario desde el token de autenticación

    // Buscar la wallet del usuario
    let userWallet = await Wallet.findOne({ where: { userId } });

    // Si la wallet del usuario no existe, crear una nueva
    if (!userWallet) {
      userWallet = await Wallet.create({ userId, balance: 0 });
    }

    // Devolver la wallet del usuario
    res.status(200).json({ wallet: userWallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar o crear la wallet del usuario.' });
  }
};

// get all wallets
exports.getWallets = async (req, res, next) => {
  try {
    const wallets = await Wallet.findAll();
    res.status(200).json({ wallets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error when getting wallets.' });
  }
};

// get que elimine todas las wallets

// Eliminar todas las wallets
exports.deleteAll = async (req, res, next) => {
  try {
    await Wallet.destroy({ where: {} });
    res.status(200).json({ message: 'All wallets have been deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error when deleting wallets.' });
  }
};
