var express = require('express');
var adminController = require('../controller/adminController');
var authController = require('/controller/authController');
var adminRouter = express.Router();

adminRouter.get('/profile',authController.authAdminController,adminController.listUsers);
adminRouter.post('/login',adminController.login);

module.exports = adminRouter;