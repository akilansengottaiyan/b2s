var express = require('express');
var userController = require('../controller/user.controller');
var authoriser = require('../utilities/authoriser');
var userRouter = express.Router();

userRouter.get('/profile', authoriser.authoriseUser, userController.getProfile);
userRouter.get('/verify', userController.verifyUser);
userRouter.get('/myProjects',userController.listProjects);
userRouter.post('/login', userController.login);
userRouter.post('/register', userController.register);
userRouter.post('/forgotpassword', authoriser.authoriseUser, userController.forgotPassword);
userRouter.post('/update', authoriser.authoriseUser, userController.updateProfile);

module.exports = userRouter;