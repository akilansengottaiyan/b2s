 const { body, validationResult } = require('express-validator/check')
const express = require('express'),
      userController = require('../controller/user.controller'),
      authoriser = require('../utilities/authoriser'),
      userRouter = express.Router(),
      validator = require('../utilities/validator');
  
userRouter.get('/profile', authoriser.authoriseUser, userController.getProfile);
userRouter.get('/verify', userController.verifyUser);
userRouter.get('/logout', userController.logOut);
userRouter.post('/login', validator.login, userController.login);
userRouter.post('/register', validator.register, userController.register);
userRouter.post('/forgotpassword', authoriser.authoriseUser, validator.forgotPassword, userController.forgotPassword);
userRouter.post('/update', authoriser.authoriseUser,validator.updateProfile, userController.updateProfile);

module.exports = userRouter;