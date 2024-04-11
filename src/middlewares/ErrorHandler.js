export const ErrorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Ha ocurrido un error interno del servidor.');
};
