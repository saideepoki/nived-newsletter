const webSocket = require('ws');
const mongoose = require('mongoose');
const Newsletter = require('./models/Newsletter'); // Adjust the path as necessary

const wss = new webSocket.Server({ port: 8080 });

wss.on('connection', (ws: any) => {
  console.log('Client connected');

  // Send initial data
  Newsletter.find().sort({ createdAt: -1 }).exec((err: any, newsletters: any) => {
    if (err) {
      console.error(err);
      return;
    }
    ws.send(JSON.stringify({ type: 'initialData', newsletters }));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Watch for changes in the Newsletter collection
const changeStream = Newsletter.watch();
changeStream.on('change', (change: any) => {
  console.log('Change detected:', change);
  // Notify all connected clients about the change
  wss.clients.forEach((client: any) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'update', change }));
    }
  });
});
