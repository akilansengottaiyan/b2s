var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var User = require('../db/userModel');

var register = function(req,res){
    bcrypt.hash(req.body.password, 8).then(hashedPassword => {
    User.create({
        email : req.body.email,
        password : hashedPassword,
        fname : req.body.fname,
        lname : req.body.lname,
        dob : req.body.date,
        isadmin : false
    }).then(user => {
        var token = jwt.sign({ email : user.email, id : user._id}, secret ,{expiresIn : 43200});
        res.status('200').send({status : "success", token : token});

    })
    }).catch(err =>{
        res.sendStatus('500');
    });
}

var login = function(req,res){
    User.findOne({email : req.body.email}).then(user => {
         if(!user){
         res.status('200').send('User not found.');
         }
         else{
         var password = req.body.password;
         bcrypt.compare(password, user.password).then(status =>{
          if(!status){
              res.status('200').send('Wrong password. Try again');
          }else{
              var secret = process.env.USER_TOKEN_SECRET;
              if(user.isAdmin){
                  secret = process.env.ADMIN_TOKEN_SECRET;
              }
              var token = jwt.sign({ email : user.email, id : user._id}, secret, {expiresIn : 43200});
              res.status('200').send({status:'success', token : token});
          }
    });
}
}).catch( err => {
    res.sendStatus('500');
});
}

var getProfile = function(req,res){

    User.findOne({email : req.encoded.email}).then(user => {
        if(!user){
        res.status('200').send('User not found.');
        }
        else{
        res.status('200').send({email : user.email,fname : user.fname ,lname : user.lname, dob : user.dob });
   }
    }).catch( err => {
        res.sendStatus('500');
    });
}

module.exports.register = register;
module.exports.login = login;
module.exports.getProfile = getProfile;

