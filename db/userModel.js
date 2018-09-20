var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
    fname :    {type : String, required : true, max : 30},
    lname :    {type:String, max : 30 },
    dob   :    {type:Date},
    email :    {type : String, required : true, unique : true},
    password : {type : String, required : true, max : 30}

});

module.exports.User = mongoose.model('user',userSchema);