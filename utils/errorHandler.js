const errorHandler = (error, customMessage = null, status) => {
    // console.log(error);
    if (customMessage) {
        return {
            status: status || 400,
            error: {
                message: customMessage
            }
        }
    } else {
        return {
            status: 400,
            error
        }
    }
}

module.exports = errorHandler