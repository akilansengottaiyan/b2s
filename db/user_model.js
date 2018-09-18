var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
    fname : String,
    lname : String,
    dob :   Date,
    email : String,
    password : String,

});

module.exports.User = mongoose.model(userSchema);