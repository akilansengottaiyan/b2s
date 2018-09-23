var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var User = require('../db/userModel');

var register = function(req,res){
    User.findOne({email : req.body.email}).then(user => {
     if(user != null){
         return res.status('200').send("User already exists.");
     }
    }).catch( err => {
         console.log(err)
         return res.status('500')
    });
    bcrypt.hash(req.body.password, 8).then(hashedPassword => {
    User.create({
        email : req.body.email,
        password : hashedPassword,
        fname : req.body.fname,
        lname : req.body.lname ? req.body.lname : null,
        dob : req.body.date ? req.body.date : null,
    }).then(user => {
        var token = jwt.sign({ id : user._id}, process.env.USER_TOKEN_SECRET ,{expiresIn : 43200});
        res.status('200').send({status : "success", token : token});
    })
    }).catch(err =>{
        console.log(err);
        res.status('500').send(err);
    });
}

var login = function(req,res){
    console.log(req.body);
    User.findOne({email : req.body.email}).then(user => {
         if(!user){
         res.status('200').send('User not found.');
         }
         else{
        console.log(user);
         var password = req.body.password;
         bcrypt.compare(password, user.password).then(status =>{
          if(!status){
              res.status('200').send('Wrong password. Try again');
          }else{
              var secret = process.env.USER_TOKEN_SECRET.toString('base64');
              if(user.isAdmin){
                  secret = process.env.ADMIN_TOKEN_SECRET;
              }
              var token = jwt.sign({ id : user._id}, secret, {expiresIn : 43200});
              res.status('200').send({status:'success', token : token});
          }
    });
}
}).catch( err => {
    res.sendStatus('500');
});
}

var getProfile = function(req,res){

    User.findOne({_id : req.decoded._id},{email:1,fname:1,lname:1,dob:1,_id:0}).then(user => {
        if(!user){
        res.status('200').send('User not found.');
        }
        else{
        res.status('200').send(user);
   }
    }).catch( err => {
        res.sendStatus('500');
    });
}

var updateProfile = function(req,res){
    User.findOne({_id : req.decoded._id}).then( user => {
        var updatedUser = new User(
        {   _id : user._id,
            email : req.body.email ? req.body.email : user.email,
            fname : req.body.fname ? req.body.fname : user.fname,
            lname : req.body.lname ? req.body.lname : user.lname,
            password : req.body.password ? bcrypt.hashSync(req.body.password,8) : user.password
        });
        updateUser.isNew = false;
        updateUser.save().then( u => {
            res.status('200').send('User profile updated successfully...');
    }).catch( err => {
            res.status('500').send(err);
        console.log(err);
    })
}).catch( err => {
    res.status('500').send(err);
    console.log(err);
});
}

var forgotPassword = function(req,res){

}

module.exports.register = register;
module.exports.login = login;
module.exports.getProfile = getProfile;
module.exports.forgotPassword = forgotPassword;
module.exports.updateProfile = updateProfile;

