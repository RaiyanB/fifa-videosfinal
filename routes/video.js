const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Upload Video
router.get('/new_video', videoController.getNewVideo);
router.post('/new_video', videoController.postNewVideo);

// Dashboard Views (all/mine)
router.get('/dashboard/:filter', videoController.getDashboard);

module.exports = router;
