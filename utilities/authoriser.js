var jwt = require('jsonwebtoken');
var jwtSecret ;

var commonAuth = function(req,res,next){
    var token = req.body.token || req.header('Authorisation');
    if(token){
     new Promise((resolve,reject) => {
        jwt.verify(token, jwtSecret, function(err ,decoded ){
            if(err){
                reject(err);
            }
            else {
            resolve(decoded);
            }
        })
     }).then(decoded => {
        req.decoded = decoded;
        next();
     }).catch( err => {
        sendResponse('401',{auth:false, message:"Token Verification Failed. "+err});
     })
    }
    else{
        sendResponse('401',{auth:false, message:"Token not found."});
    }
}

var authoriseAdmin = function(req,res,next){
    jwtSecret = process.env.ADMIN_TOKEN_SECRET;
    commonAuth(req,res,next);
}

var authoriseUser = function(req,res,next){
    jwtSecret = process.env.USER_TOKEN_SECRET;
    commonAuth(req,res,next);
}

module.exports.authoriseUser = authoriseUser ;
module.exports.authoriseAdmin = authoriseAdmin ;