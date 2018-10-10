var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var User = require('../models/user.model');
var isEmailValid = require('../utilities/emailValidator');
var mailSender = require('../utilities/mailSender');
var sendResponse = require('../utilities/sendResponse');

var register = function(req,res){
     new Promise((resolve,reject) => {
    User.findOne({email : req.body.email}).then(user => {
     if(user != null){
         resolve('200', 'User already exists.');
     }
    }).catch( err => {
        console.log("@@@@@@@");
         console.log(err);
         resolve('500','Internal Server Error.');
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
        var body = 'Hello ' +  user.fname + ',<br><a href= "'+ link + '">Click here to verify your emailId';
        mailSender(user.email,subject,body);
        resolve('200',{status :"Successfully registered", token : token});
    }).catch(err =>{
        console.log("****");
        console.log(err);
        resolve('500',err);
    })
    }).catch(err =>{
        console.log("&&&&&&");
        console.log(err);
        resolve('500',err);
    });
   }).catch (err => {
       console.log("%%%%%%%");
       console.log(err);
       resolve('200',err);
   })
}).then((status,msg) => {
    console.log("inside............................");
    console.log(status);
    sendResponse(res,status,msg);
});
}

var login = function(req,res){
    console.log(req.body);
    new Promise((resolve,reject) => {
    User.findOne({email : req.body.email}).then(user => {
         if(!user){
            resolve('200','User not found');
         }
         else
         {
            var password = req.body.password;
            bcrypt.compare(password, user.password).then(status =>{
            if(!status)
            {
                resolve('200','Wrong password.Try again.');
            }
            else
            {
                var secret = process.env.USER_TOKEN_SECRET.toString('base64');
                if(user.isAdmin){
                    secret = process.env.ADMIN_TOKEN_SECRET.toString('base64');
                }
                var token = jwt.sign({ id : user._id, email : user.email}, secret, {expiresIn : 43200});
                resolve('200',{status :"Successfully logged in.",token : token});
            }
        }).catch( err => {
            resolve('500', "Internal Server Error.");
        });
        }
    }).catch( err => {
        resolve('500', "Internal Server Error.");
    });
    }).then((status,msg) =>{
        sendResponse(res,status,msg);
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
            User.updateOne({email : user.email}, {$unset: {"randomHash" : 1}});
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
    sendResponse('500','Internal Server Error');
});
}

var myProjects = function (req,res){
    
}

module.exports.register = register;
module.exports.login = login;
module.exports.getProfile = getProfile;
module.exports.forgotPassword = forgotPassword;
module.exports.updateProfile = updateProfile;
module.exports.verifyUser = verifyUser;
module.exports.listProjects = myProjects;

