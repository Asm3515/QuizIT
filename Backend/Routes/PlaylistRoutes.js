const express = require('express');
const router = express.Router();
const PlaylistController = require("../Controller/PlaylistController")

router.post('/', PlaylistController.createPlaylist);
router.delete('/:username/:playlistNumber', PlaylistController.deletePlaylist);
router.get('/:username', PlaylistController.getPlaylistsByUser);

module.exports = router;
