const fs = require('fs');
const path = require('path');
const videosPath = path.join(__dirname, '../data/videos.json');

// Utility function to load videos safely
function loadVideos() {
  try {
    const data = fs.readFileSync(videosPath);
    return data.length ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read videos.json:', err);
    return [];
  }
}

// GET /video/new_video
exports.getNewVideo = (req, res) => {
  if (!req.session.user) {
    req.session.message = 'You must be logged in to upload a video.';
    return res.redirect('/auth/login');
  }
  res.render('new_video', { error: null });
};

// POST /video/new_video
exports.postNewVideo = (req, res) => {
  if (!req.session.user) {
    req.session.message = 'You must be logged in to upload a video.';
    return res.redirect('/auth/login');
  }

  const { title, url } = req.body;

  if (!title || !url) {
    return res.render('new_video', { error: 'Both title and URL are required.' });
  }

  const videos = loadVideos();

  videos.push({
    title: title.trim(),
    url: url.trim(),
    uploader: req.session.user.email
  });

  fs.writeFileSync(videosPath, JSON.stringify(videos, null, 2));
  res.redirect('/video/dashboard/all');
};

// GET /video/dashboard/:filter
exports.getDashboard = (req, res) => {
  if (!req.session.user) {
    req.session.message = 'You must login to access this content';
    return res.redirect('/auth/login');
  }

  const filter = req.params.filter || 'all';
  const videos = loadVideos();

  const filtered = filter === 'mine'
    ? videos.filter(v => v.uploader === req.session.user.email)
    : videos;

  res.render('dashboard', {
    videos: filtered,
    filter,
    username: req.session.user.name
  });
};
