const express = require('express'),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    helmet = require('helmet'),
    compress = require('compression'),
    fs = require('fs'),
    spdy = require('spdy');

    config = require('./app/db/config'),
    

    userRouter = require('./app/routes/user.routes');
    adminRouter = require('./app/routes/admin.routes');
    projectRouter = require('./app/routes/project.routes');
    validator = require('./app/utilities/validator');
    PORT = process.env.PORT;    
    app = express();

mongoose.connect(config.url,{useNewUrlParser:true});
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended:true }));
app.use(bodyparser.json());
app.use(helmet());
app.use(compress());
app.use(express.static('front/'));
//app.post('/*',validator.sanitisation);
app.use('/admin',adminRouter);
app.use('/user',userRouter);
app.use('/project',projectRouter);
app.use('/',function(req,res,next){
    res.sendFile('home.html', {root: 'front/'}); 
});
const options = {
    key: fs.readFileSync('./app/https/server.key'),
    cert:  fs.readFileSync('./app/https/server.crt'),
    passphrase : "akilan0306"
}
spdy.createServer(options,app).listen(PORT);

console.log("Server Listening on portno -> " + PORT);
