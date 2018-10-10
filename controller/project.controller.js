var Project = require('../models/project.model');
var sendResponse = require('../utilities/sendResponse');

var listProjects = function(req,res){
    Project.find({}).then( projects => {
       sendResponse(res,'200',projects);
    }).catch( err => {
        sendResponse(res,'500',"Internal Server Error.");
    });
}

var getProject = function(req,res){
    Project.find({projectId : req.params.projectId}).then(project => {
        sendResponse(res,'200',project);
    }).catch( err => {
        sendResponse(res,'500',"Internal Server Error.");
    });
}

var addProject = function(req,res){
     
}
var deleteProject = function(req,res){
    
}
var editProject = function(req,res){
    
}

module.exports.listProjects = listProjects;
module.exports.getProject = getProject;
module.exports.addProject = addProject;
module.exports.deleteProject = deleteProject;
module.exports.editProject = editProject;