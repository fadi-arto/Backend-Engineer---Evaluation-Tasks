const express = require('express');
const router = express.Router();
const { streamRecording } = require('../handlers/media');

router.get('/uploads/:filename', streamRecording);

module.exports = router;