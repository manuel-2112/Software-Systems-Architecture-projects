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

// Crear el cliente MQTT
const client = mqtt.connect(options);

let isConnected = false;

// Manejadores de eventos MQTT
client.on('connect', () => {
  if (!isConnected) {
    isConnected = true;
    console.log('Conexión exitosa al servidor MQTT');

    // Suscribirse a los temas
    const topics = ['stocks/info', 'stocks/requests', 'stocks/validation'];
    topics.forEach((topic) => {
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Suscrito al tema ${topic}`);
        }
      });
    });
  }
});

client.on('message', async (topic, message) => {
  if (topic === 'stocks/info') {
    const stockInfo = JSON.parse(message.toString());
    const stocksArray = JSON.parse(stockInfo.stocks);

    console.log('Información de acciones recibida:', stocksArray);

    // Enviar cada stock al backend
    for (const stock of stocksArray) {
      try {
        console.log(`Stock ${stock.symbol} creado en el backend.`);
        const response = await axios.post('http://node_app:3000/stocks', stock);
      } catch (error) {
        console.error(`Error al crear el stock ${stock.symbol}: ${error.message}`);
      }
    }
  } else if (topic === 'stocks/requests') {
    // Handle messages from 'stocks/requests' channel
    // Add your code to process requests here
  } else if (topic === 'stocks/validation') {
    // Handle messages from 'stocks/validation' channel
    // Add your code to handle validation messages here
  }
});

client.on('message', async (topic, message) => {
  if (topic === 'stocks/validation') {
    try {
      const validationInfo = JSON.parse(message.toString());
      console.log(validationInfo);
      if (validationInfo.group_id === 30 && validationInfo.valid) {
        const response = await axios.post('http://node_app:3000/portafolio/comprar-accion', validationInfo);
      } else {
        // Solicitud fue inválida

      }
    } catch (error) {
      console.error(`Error al procesar el mensaje de validación: ${error.message}`);
    }
  }
});

// escuchar canal stocks/requests
client.on('message', async (topic, message) => {
  if (topic === 'stocks/requests') {
    console.log('Mensaje recibido en el canal stocks/requests-------------------------');
    console.log(message);
    try {
      const requestInfo = JSON.parse(message.toString());
      console.log(requestInfo);
    } catch (error) {
      console.error(`Error al procesar el mensaje de validación: ${error.message}`);
    }
  }
});

client.on('error', (error) => {
  console.error('Error de conexión:', error);
});
