const express = require('express');
const router = express.Router();
const { uploadFile } = require('../middleware/upload');
const {addRecording ,getRecordingsBySession,updateMedia,deleteMedia,getMediaById} = require('../controllers/recordingController');
const { requireAuth} = require('../middleware/authMiddleware');

router.post('/upload',  uploadFile,requireAuth,  addRecording )
router.get('/get-recordings', requireAuth,getRecordingsBySession )
router.put('/update-media',uploadFile, requireAuth,updateMedia )
router.get('/get-media-by-id', requireAuth,getMediaById )
router.delete('/delete-media', requireAuth,deleteMedia )




module.exports = router;
