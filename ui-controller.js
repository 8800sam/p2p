function updateVideoGrid(files, peerId) {
  const grid = document.getElementById('video-grid');
  
  files.forEach(file => {
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    videoItem.innerHTML = `
      <div class="video-thumbnail">
        <svg width="64" height="64" viewBox="0 0 24 24">
          <path fill="#666" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
        </svg>
      </div>
      <div class="video-info">
        <div class="video-title">${file.name}</div>
        <div class="video-peer">From: Peer ${peerId}</div>
      </div>
    `;
    
    videoItem.onclick = () => requestVideo(file.name, peerId);
    grid.appendChild(videoItem);
  });
}

function requestVideo(filename, peerId) {
  const connections = Array.from(peer.connections.get(peerId) || []);
  if (connections.length > 0) {
    connections[0].send({
      type: 'request_file',
      filename: filename
    });
  }
}

// Modal controls
const modal = document.getElementById('player-modal');
const closeBtn = document.querySelector('.close');

closeBtn.onclick = () => {
  modal.style.display = 'none';
  const player = document.getElementById('video-player');
  player.pause();
  player.src = '';
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    const player = document.getElementById('video-player');
    player.pause();
    player.src = '';
  }
};