var jwt = require('jsonwebtoken');
var authAdminController = function(req,res,next){
    var token = req.body.token || req.header['x-access-token'];
    if(token){
        var jwtSecret = process.env.adminToken;
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
        var jwtSecret = process.env.userToken;
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

module.exports.authUserController = authUserController ;
module.exports.authAdminController = authAdminController ;