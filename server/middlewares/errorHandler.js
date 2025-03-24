// centrelised error handler

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err.stack || err);  // Fallback in case err.stack doesn't exist
    res.status(500).json({
        status: 500,
        message: "Something went wrong",
        error: err.message || "Unknown error"
    });
};

export default errorHandler;