const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const sendResponse = require('./sendResponse');

module.exports.sanitisation1 = function(req,res,next){
    var sanitisationArray = [];
    for(i in req.body){
        if(i != req.body.password){
            var x = sanitizeBody(i).trim().escape();
            sanitisationArray.push(x);
         }
    }
    sanitisationArray.push(function(){
        next();
    });
    return sanitisationArray;
}


module.exports.sanitisation2 = [ //function(req,res,next){

    sanitizeBody('fname').trim().escape(),
    sanitizeBody('email').trim().escape()
]

module.exports.login = [
    body('email').trim().isEmail().withMessage('Not in the email format'),
    body('password').isLength({min : 8}).withMessage('Password must have 8 characters.'),
    (req,res,next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        sendResponse(res,{status: 422 ,body:errors.array()});
    }
    else{
        console.log("No errros found.");
        next();
    }
}
]

module.exports.register = [
    body('fname').isLength({ min: 3, max:20 }).withMessage('First name must have minimum 3 chars and maximum 20 chars.')
    .isAlpha().withMessage('First name has non-alphabetic characters.'),
    body('lname').trim().isLength({ max: 20 }).trim().withMessage('Family name must be specified.')
    .isAlpha().withMessage('Last name has non-alphabetic characters.'),
    body('email').trim().isEmail().withMessage('Not in the email format'),
    body('password').isLength({min : 8}).withMessage('Password must have 8 characters.'),
    (req,res,next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        sendResponse(res,{status: 422 ,body:errors.array()});
    }
    else{
        console.log("No errros found.");
        next();
    }
}
]

module.exports.forgotPassword = [

]


module.exports.updateProfile = [
    body('fname').optional().isLength({ min: 3, max:20 }).withMessage('First name must have minimum 3 chars and maximum 20 chars.')
    .isAlpha().withMessage('First name has non-alphabetic characters.'),
    body('lname').optional().trim().isLength({ max: 20 }).trim().withMessage('Family name must be specified.')
    .isAlpha().withMessage('Last name has non-alphabetic characters.'),
    body('password').optional().isLength({min : 8}).withMessage('Password must have 8 characters.'),
    (req,res,next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        sendResponse(res,{status: 422 ,body:errors.array()});
    }
    else{
        console.log("No errros found.");
        next();
    }
}
]
