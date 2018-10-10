var express = require('express');
var projectController = require('../controller/project.controller');
var projectRouter = express.Router();
var auth  = require('../utilities/authoriser')

projectRouter.get('/list',projectController.listProjects);
projectRouter.get('/get:projectId', projectController.getProject);
projectRouter.get('/delete:projectId',auth.authoriseUser, projectController.deleteProject)
projectRouter.post('/add',auth.authoriseUser, projectController.addProject);
projectRouter.post('/edit:projectId',auth.authoriseUser, projectController.editProject);

module.exports = projectRouter;