var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var User = require('../db/userModel');
var isEmailValid = require('../utilities/emailValidator');
var mailSender = require('../utilities/mailSender');

var register = function(req,res){
    User.findOne({email : req.body.email}).then(user => {
     if(user != null){
         return res.status('200').send("User already exists.");
     }
    }).catch( err => {
         console.log(err)
         return res.status('500')
    });
    isEmailValid(req.body.email).then( () => {
    bcrypt.hash(req.body.password, 8).then(hashedPassword => {
    User.create({
        email : req.body.email,
        password : hashedPassword,
        fname : req.body.fname,
        lname : req.body.lname ? req.body.lname : null,
        dob : req.body.date ? req.body.date : null,
        randomHash : jwt.sign({email : req.body.email}, "Vaangada" ,{expiresIn : 120})
    }).then(user => {
        var token = jwt.sign({ id : user._id, email : user.email}, process.env.USER_TOKEN_SECRET ,{expiresIn : 43200});
        subject = "B2S Verification Email";
        link = "http://" + req.get('host') + '/user/verify?email=' + user.email + '&hash=' + user.randomHash;
        var body = "Hello,\n Please Click on the link to verify your email within 30 minutes.\n"+link;
        mailSender(user.email,subject,body);
        res.status('200').send({status : "Successfully registered...", token : token});
    }).catch(err =>{
        console.log(err);
        res.status('500').send(err);
    })
    }).catch(err =>{
        console.log(err);
        res.status('500').send(err);
    });
   }).catch (err => {
       console.log(err);
       res.status('200').send(err);
   })
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
              var token = jwt.sign({ id : user._id, email : user.email}, secret, {expiresIn : 43200});
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
var sendResponse = function(res, status, body){
   res.status(status).send(body);
}

var verifyUser = function(req,res){
User.findOne({email : req.query.email}).then( user =>{
    if(!user){
        sendResponse(res,'200','Sorry. Try signing up again.');
    }
    else if(!(user.randomHash)){
        sendResponse(res,'200','User already verified.');
    }
    else if(user.randomHash == req.query.hash){
        new Promise( (resolve,reject) => {
        jwt.verify(req.query.hash , 'Vaangada', function(err,decoded){
            if(err){
            reject(err);
            }
            else{
            resolve();
            }
        })
    }).then(() => {
            sendResponse(res,'200','User verification success.');
            User.update({email : user.email}, {$unset: {randomHash : 1}});
        }).catch(err => {
            User.remove({_id : user._id});
            sendResponse(res,'200','Sorry. Token expired. Try signup.');
        })
   }
    else{
        sendResponse(res,'401','Token invalid');
    }
}).catch(err => {
    console.log(err);
    res.sendStatus('500');
});
}

module.exports.register = register;
module.exports.login = login;
module.exports.getProfile = getProfile;
module.exports.forgotPassword = forgotPassword;
module.exports.updateProfile = updateProfile;
module.exports.verifyUser = verifyUser;

