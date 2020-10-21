// https://dev.to/nedsoft/central-error-handling-in-express-3aej

const isDev = process.env.NODE_ENV === 'development';

class ErrorHandler extends Error {
    constructor(statusCode, message, error) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
    }
}

const handleError = (err, res) => {
    // message is either a string or an object with field and message keys (for 400 errors)
    const { statusCode, message } = err;

    if (isDev) console.error(err);

    res.status(statusCode || 500).json({
        status: "error",
        statusCode,
        ...(statusCode === 400 && { errors: message }),
        ...(statusCode !== 400 && { message })
    });
};


module.exports = {
    ErrorHandler,
    handleError
}