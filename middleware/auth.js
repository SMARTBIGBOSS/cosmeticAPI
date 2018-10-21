const jwt = require("jsonwebtoken");

function auth(req, res, next){
    let token = req.header('x-auth-token');
    if(!token)
        return res.status(401).send('Access denied. No Token Provided!');
    else{
        try{
            let decoded = jwt.verify(token, 'JwtKey');
            req.seller = decoded;
            next();
        }
        catch (e) {
            res.status(400).send('Invalid token!');
        }
    }
}

module.exports = auth;