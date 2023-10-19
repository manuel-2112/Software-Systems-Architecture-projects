const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use(cors()); // Utiliza el middleware cors

// CRUD routes
app.use('/stocks', require('./routes/stocks'));
app.use('/wallet', require('./routes/wallet'));

app.use('/portafolio', require('./routes/portafolio'));
app.use('/portafolioitem', require('./routes/portafolioitem'));
app.use('/buylist', require('./routes/buylist'));

// error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const { message } = error;
  res.status(status).json({ message });
});

// sync database
sequelize
  .sync()
  .then((result) => {
    console.log('Database connected');
    app.listen(3000);
  })
  .catch((err) => console.log(err));
