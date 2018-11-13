const jwt = require('jsonwebtoken'),
      bcrypt = require('bcryptjs'),
      cookieParser = require('cookie-parser'),
      cookieEncrypter = require('cookie-encrypter'),
      User = require('../models/user.model'),
      isEmailValid = require('../utilities/emailValidator'),
      mailSender = require('../utilities/mailSender'),
      sendResponse = require('../utilities/sendResponse');
         
const cookieParams = {
        httpOnly: true,
        signed: true,
        maxAge: 300000,
        secure : true
      };

var register = function(req,res){
    new Promise((resolve,reject) => {
   User.findOne({email : req.body.email}).then(user => {
    if(user != null)
    {
        resolve({status : '400', body : "User already exists"});
    }
    else
    {
        isEmailValid(req.body.email).then( () => {
           return bcrypt.hash(req.body.password, 8);
        }).then(hashedPassword => {
            return User.create({
                email : req.body.email,
                password : hashedPassword,
                fname : req.body.fname,
                lname : req.body.lname ? req.body.lname : null,
                dob : req.body.date ? req.body.date : null,
                randomHash : jwt.sign({email : req.body.email}, "Vaangada" ,{expiresIn : 120}) });
        }).then(user => {
                subject = "B2S Verification Email";
                link = "https://" + req.get('host') + '/user/verify?email=' + user.email + '&hash=' + user.randomHash;
                var body = 'Hello ' +  user.fname + ',<br><a href= "'+ link + '">Click here to verify your emailId';
                mailSender(user.email,subject,body);
                resolve({status :200, body : "Registration Success. Verify your email"});
        }).catch( err => {
            console.log(err);
            reject({status:'500' ,body: err }); 
      })
    }
    });
    }).then(result => {
        console.log(result);
    sendResponse(res,result);
    }).catch( result => {
    sendResponse(res,result);
    });
}  

var login = function(req,res){
    new Promise((resolve,reject) => {
    User.findOne({email : req.body.email}).then(user => {
         if(!user){
            resolve({status:'400', body:'User not found'});
         }
         else
         {
            if(user.randomHash)
            {
                resolve({status:'200', body:'Verify your email-id to proceed'});
            }
            else
            {
                bcrypt.compare(req.body.password, user.password).then(status =>{
                if(!status)
                    resolve({status:'200', body:'Wrong password'});
                else
                {
                    var secret = (user.isAdmin)? process.env.ADMIN_TOKEN_SECRET.toString('base64') : process.env.USER_TOKEN_SECRET.toString('base64');
                    var token = jwt.sign({ id : user._id, email : user.email}, secret, {expiresIn : 43200});
                    res.cookie('jwttoken', token, cookieParams);
                    resolve({status :"200",body : "Login Successful" } );
                }
                }).catch( err => {
                    reject({status:'500',body: "Internal Server Error."+ err});
                });
            }
    }
    }).catch( err => {
        reject({status : '500',body: "Internal Server Error."});
    });
    }).then( result =>{
        sendResponse(res,result);
    }).catch(result => {
        sendResponse(res,result);
    });
}

var getProfile = function(req,res){
    new Promise( (resolve,reject) =>{
    User.findOne({email : req.decoded.email},{email:1,fname:1,lname:1,dob:1,_id:0}).then(user => {
        if(!user){
            resolve({status :'200', body :'User not found.'});
        }
        else{
            resolve({status : '200', body :user});
        }
    }).catch( err => {
        resolve({status :'500', body :'Internal Server Error'});
    })
    }).then((result) => {
        sendResponse(res,result);
    });
}

var updateProfile = function(req,res){
    User.findOne({email : req.decoded.email}).then( user => {
        return user.updateOne(req.body);
    }).then( () => {
        sendResponse(res,{status :'200', body :'User profile updated successfully...'});
    }).catch( err => {
        sendResponse(res,{status : '500' , body:err});;
        console.log(err);
    });
}

var forgotPassword = function(req,res){


}

var verifyUser = function(req,res){
    new Promise( (resolve,reject) => {
        User.findOne({email : req.query.email}).then( user =>{
            if(!user){
                reject({status:'400',body:'Sorry.Try signing up again.'});
            }
            else if(!(user.randomHash)){
                reject({status:'200',body:'User already verified'});
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
                    resolve({status:'200', body:"User verfication success"});
                    User.updateOne({email : user.email}, {$unset: {"randomHash" : 1}});
                }).catch(err => {
                    User.remove({_id : user._id});
                    reject({status:'400', body:'Token Expired.'});
                })
        }
            else{
                reject({status:'401', body:'Token Invalid.'});
            }
        }).catch(err => {
            console.log(err);
            reject({status:'500', body:'Internal Server Error'});
        });
    }).then(result => {
        sendResponse(res,result);
    }).catch(result => {
        sendResponse(res,result);
    });
}

var logOut = function(req,res,next){
    res.clearCookie('jwttoken');
    sendResponse(res,{status : 200, body : "Logged Out Successful"});
}

module.exports.register = register;
module.exports.login = login;
module.exports.getProfile = getProfile;
module.exports.forgotPassword = forgotPassword;
module.exports.updateProfile = updateProfile;
module.exports.verifyUser = verifyUser;
module.exports.logOut = logOut;