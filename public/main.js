// client-side js, loaded by index.html
// run by the browser each time the page is loaded

let Peer = window.Peer;

let messagesEl = document.querySelector('.messages');
let peerIdEl = document.querySelector('#connect-to-peer');
let videoEl = document.querySelector('.remote-video');

let logMessage = (message) => {
  let newMessage = document.createElement('div');
  newMessage.innerText = message;
  messagesEl.appendChild(newMessage);
};

let renderVideo = (stream) => {
  videoEl.srcObject = stream;
};

// Register with the peer server
let peer = new Peer({
  host: window.peerConfig?.host || '/',
  port: window.peerConfig?.port,
  path: window.peerConfig?.path || '/peerjs/myapp',
  secure: window.peerConfig?.secure
});
peer.on('open', (id) => {
  logMessage('My peer ID is: ' + id);
});
peer.on('error', (error) => {
  console.error(error);
});

// Handle incoming data connection
peer.on('connection', (conn) => {
  logMessage('incoming peer connection!');
  conn.on('data', (data) => {
    logMessage(`received: ${data}`);
  });
  conn.on('open', () => {
    conn.send('hello!');
  });
});

// Handle incoming voice/video connection
peer.on('call', (call) => {
  navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then((stream) => {
      call.answer(stream); // Answer the call with an A/V stream.
      call.on('stream', renderVideo);
    })
    .catch((err) => {
      console.error('Failed to get local stream', err);
    });
});

// Initiate outgoing connection
let connectToPeer = () => {
  let peerId = peerIdEl.value;
  logMessage(`Connecting to ${peerId}...`);
  
  let conn = peer.connect(peerId);
  conn.on('data', (data) => {
    logMessage(`received: ${data}`);
  });
  conn.on('open', () => {
    conn.send('hi!');
  });
  
  navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then((stream) => {
      let call = peer.call(peerId, stream);
      call.on('stream', renderVideo);
    })
    .catch((err) => {
      logMessage('Failed to get local stream', err);
    });
};

window.connectToPeer = connectToPeer;