const mongoose = require('mongoose');
const { getGfsBucket } = require('../config/gridFs'); 

module.exports.streamRecording = async (req, res) => {
    try {
        const { filename } = req.params;

        const gfsBucket = getGfsBucket();
        if (!gfsBucket) {
            console.error('gfsBucket is not initialized');
            return res.status(500).json({
                status: 'error',
                message: 'GridFSBucket is not ready',
            });
        }

        const downloadStream = gfsBucket.openDownloadStreamByName(filename);

        downloadStream.on('error', (error) => {
            console.error('Stream error:', error);
            return res.status(404).json({
                status: 'error',
                message: 'File not found',
                error: error.message,
            });
        });

        res.set({
            'Content-Type': filename.endsWith('.mp4') ? 'video/mp4' : 'audio/mpeg',
            'Content-Disposition': `inline; filename="${filename}"`,
        });

        downloadStream.pipe(res);
    } catch (error) {
        console.error('Error streaming file:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error streaming the file',
            error: error.message,
        });
    }
};