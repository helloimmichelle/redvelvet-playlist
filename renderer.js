
const path = require('path');
const fs = require('fs');

const audioPlayer = document.getElementById('audioPlayer');
const playlist = document.getElementById('playlist');
const albumArt = document.getElementById('albumArt');

let tracks = [];
let currentTrackIndex = 0;

const musicDir = path.join(__dirname, 'assets', 'music');

// Load playlist
function loadPlaylist() {
  fs.readdir(musicDir, (err, files) => {
    if (err) {
      console.error("Failed to load music folder:", err);
      return;
    }

    const audioFiles = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav'));
    tracks = audioFiles.map(file => ({
      name: file,
      path: path.join(musicDir, file)
    }));

    buildPlaylistUI();
    if (tracks.length > 0) playTrack(0);
  });
}

// Build UI list
function buildPlaylistUI() {
  playlist.innerHTML = '';
  tracks.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = track.name;
    li.addEventListener('click', () => {
      playTrack(index);
    });
    playlist.appendChild(li);
  });
}

// Play selected track
function playTrack(index) {
  const track = tracks[index];
  currentTrackIndex = index;
  audioPlayer.src = track.path;
  loadAlbumArt(track.path);
  audioPlayer.play();
}

// Play previous track
function playPreviousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(currentTrackIndex);
  }

  // Play next track
function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack(currentTrackIndex);
  }

// Load album art
function loadAlbumArt(audioPath) {
    const path = require('path');
  
    const fileName = path.basename(audioPath, path.extname(audioPath)); // matches "song.mp3" and "song.jpeg"
    const imagePath = path.join(__dirname, 'assets', 'album art', `${fileName}.jpeg`);
  
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      albumArt.src = err ? 'default.jpg' : `file://${imagePath}`;
    });
  }
  

// Auto play next track
audioPlayer.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  playTrack(currentTrackIndex);
});

loadPlaylist();
