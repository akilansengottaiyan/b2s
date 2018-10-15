var kickbox  = require('kickbox').client('live_a6d1f7bc7302fc3d0d31294bf5757f7ecab547673d031af0ad37d3e25a1c9c0c').kickbox();
var isEmailValid = function(email){
    return new Promise((resolve,reject) => {
        if(email == "akilan0306@gmail.com"){
            resolve();
        }
        else {
        kickbox.verify(email, function(err,response) {
            if(err){
             reject(err);
            }
            else{
                if(response.body.result == "deliverable"){
                    resolve();
                }else{
                   reject(response.body.reason);  
                }
            }
        });
    }
    });

}

module.exports = isEmailValid;