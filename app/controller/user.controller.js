var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var User = require('../models/user.model');
var isEmailValid = require('../utilities/emailValidator');
var mailSender = require('../utilities/mailSender');
var sendResponse = require('../utilities/sendResponse');

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
                var token = jwt.sign({ id : user._id, email : user.email}, process.env.USER_TOKEN_SECRET ,{expiresIn : 43200});
                subject = "B2S Verification Email";
                link = "http://" + req.get('host') + '/user/verify?email=' + user.email + '&hash=' + user.randomHash;
                var body = 'Hello ' +  user.fname + ',<br><a href= "'+ link + '">Click here to verify your emailId';
                mailSender(user.email,subject,body);
                resolve({status :200, body : token});
        }).catch( err => {
            console.log(err);
            reject({status:'500' ,body: "Internal Server Error" }); 
      })
    }
    });
    }).then(result => {
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
            bcrypt.compare(req.body.password, user.password).then(status =>{
            if(!status)
                resolve({status:'200', body:'Wrong password'});
            else
            {
                var secret = (user.isAdmin)? process.env.ADMIN_TOKEN_SECRET.toString('base64') : process.env.USER_TOKEN_SECRET.toString('base64');
                var token = jwt.sign({ id : user._id, email : user.email}, secret, {expiresIn : 43200});
                resolve({status :"200",body : {token : token} } );
            }
        }).catch( err => {
            reject({status:'500',body: "Internal Server Error."});
        });
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
    User.findOne({_id : req.decoded._id},{email:1,fname:1,lname:1,dob:1,_id:0}).then(user => {
        if(!user){
            resolve('200','User not found.');
        }
        else{
            resolve('200',user);
        }
    }).catch( err => {
        resolve('500','Internal Server Error');
    })
    }).then((status,msg) => {
        sendResponse(res,status,msg);
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
        sendResponse(result);
    }).catch(result => {
        sendResponse(result);
    });
}

module.exports.register = register;
module.exports.login = login;
module.exports.getProfile = getProfile;
module.exports.forgotPassword = forgotPassword;
module.exports.updateProfile = updateProfile;
module.exports.verifyUser = verifyUser;
