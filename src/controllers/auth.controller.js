const jwt = require('jsonwebtoken')
const config = require('../config/auth.config')

module.exports = {
    checkToken : (req, res) => {
        let token = req.headers['authorization'] || null

        if(token == null){
            res.status(401).json({statusCode : 401, message : "Invalid Token" })
            return;
        }

        token = token.split(" ")
        token = token[1]

        //Xác thực token
        let tokenDecode = null
        jwt.verify(token, config.secret, function(err, decode){
            tokenDecode = !err ? decode : null;
        })

        var dateNow = new Date();
        if(tokenDecode == null || tokenDecode.exp < dateNow.getTime() / 1000){
            res.status(401).json({statusCode : 401, message : "Invalid Token Or Token Expired" })
            return;
        }

        if(tokenDecode != null){
            let data = {}
            data.accessToken = token
            res.status(200).json(data);
        }
    }
}