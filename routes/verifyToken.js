const jwt = require('jsonwebtoken');
const config = require('../config/config');


module.exports =  (req,res,next) => {
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).send('Access Denied')
    } 
    try{
        const verified = jwt.verify(token,config.jwtsecret);
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).send("invalid Token");
    }
}