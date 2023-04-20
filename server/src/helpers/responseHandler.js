exports.errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        ok: false,
        message: message
    })
}

exports.successResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        ok: true,
        message: message
    })
}