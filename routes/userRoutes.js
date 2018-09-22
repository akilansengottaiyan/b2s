var express = require('express');
var userController = require('../controller/userController');
var authController = require('../controller/authController');
var userRouter = express.Router();
userRouter.get('/profile', authController.authUserController, userController.getProfile);
userRouter.post('/login', userController.login);
userRouter.post('/register', userController.register);

module.exports = userRouter;