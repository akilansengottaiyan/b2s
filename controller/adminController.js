var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var User = require('../db/userModel.js');

var listUsers = function(req,res){
   User.find().then(users => {
       res.status('200').send({users : users});
   }).catch(err => {
       res.sendStatus('500');
   });
}

module.exports.listUsers = listUsers;