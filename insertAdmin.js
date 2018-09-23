var fs = require('fs'),
    User  = require('./db/userModel')

var insertAdmin = function(){
    fs.readFile('./admin.json','utf8' ,(err,data) => {
        var admin = JSON.parse(data);
        admin.isadmin = true;
        User.insert(admin);
});
}

insertAdmin();
