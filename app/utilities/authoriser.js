const jwt = require('jsonwebtoken'),
      sendResponse = require('./sendResponse');

var jwtSecret ;

var commonAuth = function(req,res,next){
    console.log(req);
    var token = req.cookies.jwttoken;
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
        sendResponse(res,{status: '401', body : {auth:false, message:"Token Verification Failed. "+err}});
     })
    }
    else{
        sendResponse(res , {status: '401', body : {auth:false, message:"Token not found."}});
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