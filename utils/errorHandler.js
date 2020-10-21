const isDev = process.env.NODE_ENV === 'development';

class ErrorHandler extends Error {
    constructor(statusCode, message, error) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;

        if (error && isDev) console.error(error);
    }
}

const handleError = (err, res) => {
    const { statusCode, message } = err;
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    });
};


module.exports = {
    ErrorHandler,
    handleError
}