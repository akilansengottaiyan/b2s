var User = require('./user.model');
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var projectSchema = new schema({
    projectId : 
            { type : String, required : true },
    name : 
            { type : String, required: true },
    description :
            { type : String },
    languages :
             { type : Array },
    owners : 
            [{
            type : schema.Types.ObjectId,
            ref : User
            }],
    contributors : 
            [{
            type : schema.Types.ObjectId,
            ref : User
            }],
    status : 
            { type: String, enum : ['Not-Started','Prototyping','Inprogress','Halted']},
    githubLink : 
            { type : String }
});

 projectModel = mongoose.model('Project',projectSchema);
 module.exports = projectModel;