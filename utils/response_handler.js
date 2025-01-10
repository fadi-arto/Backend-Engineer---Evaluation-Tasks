module.exports.successResponse = (res, message = 'Success', data = {}) => {
    return res.status(200).json({
        status: 'success',
        message,
        data
    });
};


module.exports.errorResponse = (res, message = 'An error occurred', error = {}||'', statusCode) => {
    return res.status(statusCode).json({
        status: 'error',
        message,
        error
    });
};  

