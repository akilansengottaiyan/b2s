var jwt = require('jsonwebtoken');

var authAdminController = function(req,res,next){
    var token = req.body.token || req.header['x-access-token'];
    if(token){
        var jwtSecret = process.env.ADMIN_TOKEN_USER;
     jwt.verify(token, jwtSecret, function(err,encoded){
         if(err){
           res.status('500').send({auth:false, message:"Failed to authenticate token."});
         }
         else{
         next();
         }
     });
    }
    else{
        res.status('401').send({auth:true, message:"Invalid token"});
    }
}
var authUserController = function(req,res,next){
    var token = req.body.token || req.header['x-access-token'];
    if(token){
        var jwtSecret = process.env.USER_TOKEN_SECRET;
     jwt.verify(token, jwtSecret).then( decoded =>{
         req.decoded = decoded;
         next();
     }).catch( err => {
         res.sendStatus('500');
    });
    }
    else{
        res.status('401').send({auth:true, message:"Invalid token"});
    }
}

module.exports.authUserController = authUserController ;
module.exports.authAdminController = authAdminController ;