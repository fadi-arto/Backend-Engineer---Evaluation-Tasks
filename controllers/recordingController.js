    const Recording = require('../models/Recording');
    const Media = require('../models/media')
    const mongoose = require('mongoose');
    const { successResponse, errorResponse } = require('../utils/response_handler');

    const { getGfsBucket } = require('../config/gridFs');

    module.exports.addRecording = async (req, res) => {
        try {
            if (!req.file) {
                return errorResponse(res, 'No file uploaded', {}, 400);
            }
            const { filename } = req.file; 
            const {  duration, type } = req.body;
    
            if ( !duration || !type) {
                return errorResponse(res,  'duration, and type are required', {}, 400);
            }
    
            if (!['audio', 'video'].includes(type)) {
                return errorResponse(res, 'Type must be either "audio" or "video"', {}, 400);
            }


            const newMedia = new Media({
                filename,
                url: `/uploads/${filename}`,
                type,
            });
            const savedMedia = await newMedia.save();
    
            const newRecording = new Recording({
                fileUrl: filename,
                media: savedMedia._id, 
                duration,
                type,
            });
    
            const savedRecording = await newRecording.save();
    
            return successResponse(res, 'Recording added successfully', savedRecording);
        } catch (error) {
            return errorResponse(res, 'An error occurred while adding the recording', error.message || {}, 500);
        }
    };
    module.exports.getRecordingsBySession = async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
    
            const offset = (page - 1) * limit;
    
            const recordings = await Recording.find()
                .populate({
                    path: 'media', 
                    select: 'url', 
                })
                .skip(offset)
                .limit(limit);
    
            if (!recordings.length) {
                return errorResponse(res, 'No recordings found', {}, 404);
            }
    
            const totalRecords = await Recording.countDocuments();
            const totalPages = Math.ceil(totalRecords / limit);
    
            const responseRecordings = recordings.map(recording => ({
                sessionId: recording.media._id,
                fileUrl: recording.media ? recording.media.url : null, 
                duration: recording.duration,
                type: recording.type,
                createdAt: recording.createdAt,
            }));
    
            return successResponse(res, 'Recordings fetched successfully', {
                recordings: responseRecordings,
                pagination: {
                    page,
                    limit,
                    totalPages,
                    totalRecords,
                },
            });
        } catch (error) {
            return errorResponse(res, 'Error fetching recordings', error.message, 500);
        }
    };


    module.exports.updateMedia = async (req, res) => {
        try {
            const { id } = req.query; 
    
            if (!req.file) {
                return errorResponse(res, 'No file uploaded', {}, 400);
            }
    
            const gfsBucket = getGfsBucket();
            if (!gfsBucket) {
                return errorResponse(res, 'GridFSBucket is not initialized', {}, 500);
            }

            const media = await Media.findById(id);
            if (!media) {
                return errorResponse(res, 'Media not found', {}, 404);
            }

            const fileCursor = await gfsBucket.find({ filename: media.filename }).toArray();
            if (fileCursor.length === 0) {
                return errorResponse(res, 'File not found in GridFS', {}, 404);
            }
    
            const fileId = fileCursor[0]._id;
            await gfsBucket.delete(fileId); 
    
            const newFilename = req.file.filename;
            const newMedia = {
                filename: newFilename,
                url: `/uploads/${newFilename}`,
                type: req.file.mimetype.startsWith('video') ? 'video' : 'audio',
            };

            const updatedMedia = await Media.findByIdAndUpdate(
                id,
                { ...newMedia },
                { new: true } 
            );
            return successResponse(res, 'Media updated successfully', updatedMedia);
        } catch (error) {
            console.error('Error updating media:', error);
            return errorResponse(res, 'Error updating media', error.message || {}, 500);
        }
    };
    
    module.exports.deleteMedia = async (req, res) => {
        try {
            const { id } = req.query; 
    
            const gfsBucket = getGfsBucket();
            if (!gfsBucket) {
                return errorResponse(res, 'GridFSBucket is not initialized', {}, 500);
            }
    
            const media = await Media.findById(id);
            if (!media) {
                return errorResponse(res, 'Media not found', {}, 404);
            }
    
            const fileCursor = await gfsBucket.find({ filename: media.filename }).toArray();
            if (fileCursor.length > 0) {
                const fileId = fileCursor[0]._id; 
                await gfsBucket.delete(fileId); 
            }
    
            await Media.findByIdAndDelete(id);
    
            const recording = await Recording.findOne({ media: id });
            if (recording) {
                await Recording.findByIdAndDelete(recording._id);
            }
    
            return successResponse(res, 'Media and associated data deleted successfully', {});
        } catch (error) {
            console.error('Error deleting media:', error);
            return errorResponse(res, 'Error deleting media', error.message || {}, 500);
        }
    };


    module.exports.getMediaById = async (req, res) => {
        try {
            const { id } = req.query; 
    
            const gfsBucket = getGfsBucket();
            if (!gfsBucket) {
                return errorResponse(res, 'GridFSBucket is not initialized', {}, 500);
            }
    
            const media = await Media.findById(id);
            if (!media) {
                return errorResponse(res, 'Media not found', {}, 404);
            }
    
            const fileCursor = await gfsBucket.find({ filename: media.filename }).toArray();
            if (fileCursor.length === 0) {
                return errorResponse(res, 'File not found in GridFS', {}, 404);
            }
    
    
            return successResponse(res, 'Media fetched successfully', {
                id: media._id,
                url: media.url,
                type: media.type,
            });
        } catch (error) {
            console.error('Error fetching media by ID:', error);
            return errorResponse(res, 'Error fetching media', error.message || {}, 500);
        }
    };