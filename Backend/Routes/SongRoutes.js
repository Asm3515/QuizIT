const express = require('express');
const router = express.Router();
const SongController = require('../Controller/SongController');

router.post('/add', SongController.addSongsToPlaylist);
router.post('/delete', SongController.deleteSongsFromPlaylist);

module.exports = router;