const errorHandler = (err, req, res, next) => {
    console.error('================================================');
    console.error('TERJADI KESALAHAN PADA SERVER!');
    console.error(`Jalur (Route): ${req.method} ${req.url}`);
    console.error(`Pesan Error: ${err.message}`);
    console.error('Stack Trace:', err.stack);
    console.error('================================================');

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: 'error',
        message: statusCode === 500 ? 'Terjadi kesalahan internal pada server.' : err.message,
        error_detail: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = { errorHandler };