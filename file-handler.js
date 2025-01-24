let localFiles = new Map();

async function shareFolder() {
  const input = document.getElementById('folder-input');
  const files = Array.from(input.files);
  
  // Filter for video files
  const videoFiles = files.filter(file => file.type.startsWith('video/'));
  
  localFiles.clear();
  
  for (const file of videoFiles) {
    localFiles.set(file.name, {
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    });
  }

  // Broadcast the new file list to all connected peers
  broadcastFileList();
}

function broadcastFileList() {
  const fileList = Array.from(localFiles.values()).map(({ name, size, type }) => ({
    name,
    size,
    type
  }));

  broadcastToAll({
    type: 'file_list',
    files: fileList
  });
}

async function sendFileData(filename, conn) {
  const fileInfo = localFiles.get(filename);
  if (!fileInfo) return;

  const file = fileInfo.file;
  const reader = new FileReader();
  
  reader.onload = (e) => {
    conn.send({
      type: 'file_data',
      filename: filename,
      data: e.target.result
    });
  };

  reader.readAsArrayBuffer(file);
}

function receiveFileData(data) {
  const blob = new Blob([data.data], { type: 'video/mp4' });
  const url = URL.createObjectURL(blob);
  
  const player = document.getElementById('video-player');
  player.src = url;
  
  const modal = document.getElementById('player-modal');
  modal.style.display = 'block';
}