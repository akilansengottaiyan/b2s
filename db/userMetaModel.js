var mongoose = require('mongoose');
var schema = mongoose.schema;
var User = require('./userModel');

var userMetaSchema = new schema({
        
    randomId : {type: Number},
    isVerfied : {type : Boolean, default : false},
    date_created : {type : Date}
});