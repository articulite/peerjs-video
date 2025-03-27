// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");

const { ExpressPeerServer } = require("peer");

const app = express();

// PeerJS configuration from environment variables
const peerConfig = {
  host: process.env.PEER_HOST || '/',
  port: process.env.PEER_PORT || 9000,
  path: process.env.PEER_PATH || '/peerjs/myapp',
  secure: process.env.PEER_SECURE === 'true'
};

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// Inject the peerjs configuration
app.get("/config.js", (request, response) => {
  response.set('Content-Type', 'application/javascript');
  response.send(`window.peerConfig = ${JSON.stringify(peerConfig)};`);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// peerjs server
const peerServer = ExpressPeerServer(listener, {
  debug: true,
  path: peerConfig.path.replace('/peerjs', '') // Remove the '/peerjs' prefix
});

app.use('/peerjs', peerServer);
