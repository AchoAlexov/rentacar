const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied! No token provided.');
    try {
        const decodedToken = jwt.verify(token, process.env.RENTACARKEY);
        req.user = decodedToken;
        next();
    } catch(ex) {
        console.log(ex);
        res.status(400).send('Ivalid token provided.');
    }
}

module.exports = auth;