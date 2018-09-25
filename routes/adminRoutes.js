var express = require('express');
var adminController = require('../controller/adminController');
var authoriser = require('../controller/authoriser');
var adminRouter = express.Router();

adminRouter.get('/profile',authoriser.authoriseAdmin,adminController.listUsers);

module.exports = adminRouter;