var express = require('express');
var adminController = require('../controller/admin.controller');
var authoriser = require('../utilities/authoriser');
var adminRouter = express.Router();

adminRouter.get('/profile',authoriser.authoriseAdmin,adminController.listUsers);

module.exports = adminRouter;