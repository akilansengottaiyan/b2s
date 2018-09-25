var jwt = require('jsonwebtoken');

var authoriseAdmin = function(req,res,next){
    var token = req.body.token || req.header('x-access-token');
    if(token){
        var jwtSecret = process.env.ADMIN_TOKEN_SECRET;
     jwt.verify(token, jwtSecret).then( decoded =>{
         req.decoded = decoded;
         next();
     }).catch( err => {
         res.sendStatus('500');
    });
    }
    else{
        res.status('401').send({auth:false, message:"Invalid token"});
    }
}

var authoriseUser = function(req,res,next){
    var token = req.body.token || req.header('x-access-token');
    if(token){
        var jwtSecret = process.env.USER_TOKEN_SECRET;
     jwt.verify(token, jwtSecret, function(err ,decoded ){
         if(err){
            res.status('500').send('Token verification failed.');
         }
         req.decoded = decoded;
         console.log(decoded);
         next();
     });
    }
    else{
        res.status('401').send({auth:false, message:"Token not found."});
    }
}

module.exports.authoriseUser = authoriseUser ;
module.exports.authoriseAdmin = authoriseAdmin ;