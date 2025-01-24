let peer;
let connections = new Set();
let sharedFiles = new Map();

function initializePeer() {
  // Generate a random 3-digit number for the peer ID
  const peerId = Math.floor(Math.random() * 900 + 100).toString();
  
  peer = new Peer(peerId, {
    config: {
      'iceServers': [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ]
    }
  });

  peer.on('open', (id) => {
    document.getElementById('peer-id').textContent = id;
  });

  peer.on('connection', handlePeerConnection);
  
  peer.on('error', (error) => {
    console.error('PeerJS error:', error);
  });
}

function connectToPeer() {
  const connectId = document.getElementById('connect-id').value;
  if (connectId.length !== 3) {
    alert('Please enter a valid 3-digit code');
    return;
  }

  const conn = peer.connect(connectId);
  handlePeerConnection(conn);
}

function handlePeerConnection(conn) {
  connections.add(conn);

  conn.on('open', () => {
    // Request file list when connection is established
    conn.send({
      type: 'request_files'
    });
  });

  conn.on('data', handlePeerData);

  conn.on('close', () => {
    connections.delete(conn);
  });
}

function handlePeerData(data) {
  switch(data.type) {
    case 'request_files':
      sendFileList(conn);
      break;
    case 'file_list':
      updateVideoGrid(data.files, conn.peer);
      break;
    case 'request_file':
      sendFileData(data.filename, conn);
      break;
    case 'file_data':
      receiveFileData(data);
      break;
  }
}

function broadcastToAll(message) {
  connections.forEach(conn => {
    if (conn.open) {
      conn.send(message);
    }
  });
}

initializePeer();