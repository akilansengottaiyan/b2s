var express = require('express');
var userController = require('../controller/userController');
var authController = require('../controller/authController');
var userRouter = express.Router();

userRouter.get('/profile', authController.authUserController, userController.getProfile);
userRouter.post('/login', userController.login);
userRouter.post('/register', userController.register);
userRouter.post('/forgotpassword', authController.authUserController, userController.forgotPassword);
userRouter.post('/update', authController.authUserController, userController.updateProfile);

module.exports = userRouter;