const mqtt = require('mqtt');
const axios = require('axios');

// Credenciales MQTT
const host = 'broker.legit.capital';
const port = 9000;
const username = 'students';
const password = 'iic2173-2023-2-students';

// Opciones de conexión MQTT
const options = {
  host,
  port,
  username,
  password,
};

exports.sendRequest = (request) => {
  const topic = 'stocks/requests';
  const message = JSON.stringify(request);
  const client = mqtt.connect(options);
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Suscrito al tema ${topic}`);
      client.publish('stocks/requests', JSON.stringify(request));
    } else {
      console.log(`ERROR al intentar la compra ${err}`);
    }
  });
};
