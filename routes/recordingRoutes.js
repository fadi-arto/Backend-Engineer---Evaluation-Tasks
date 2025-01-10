const express = require('express');
const router = express.Router();
const { uploadFile } = require('../middleware/upload');
const {addRecording ,getRecordingsBySession,updateMedia,deleteMedia,getMediaById} = require('../controllers/recordingController');
const { requireAuth} = require('../middleware/authMiddleware');

router.post('/api/manage-recording/upload',  uploadFile,requireAuth,  addRecording )
router.get('/api/manage-recording/get-recordings', requireAuth,getRecordingsBySession )
router.put('/api/manage-recording/update-media',uploadFile, requireAuth,updateMedia )
router.get('/api/manage-recording/get-media-by-id', requireAuth,getMediaById )
router.delete('/api/manage-recording/delete-media', requireAuth,deleteMedia )




module.exports = router;
