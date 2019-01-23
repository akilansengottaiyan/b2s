const express = require('express'),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    helmet = require('helmet'),
    compress = require('compression'),
    fs = require('fs'),
    spdy = require('spdy'),
    cookieParser = require('cookie-parser'),
    cookieEncrypter = require('cookie-encrypter');

    config = require('./app/db/config'),
    
    userRouter = require('./app/routes/user.routes');
    adminRouter = require('./app/routes/admin.routes');
    projectRouter = require('./app/routes/project.routes');
    validator = require('./app/utilities/validator');
    PORT = process.env.PORT;    
    COOKIE_SECRET = process.env.COOKIE_SECRET ;
    app = express();

    const httpsOptions = {
        key: fs.readFileSync('./app/https/server.key'),
        cert:  fs.readFileSync('./app/https/server.crt'),
        passphrase : "akilan0306"
    }

mongoose.connect(config.url,{useNewUrlParser:true});
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended:true }));
app.use(bodyparser.json());
app.use(helmet());
app.use(compress());
app.use(cookieParser(COOKIE_SECRET));
app.use(cookieEncrypter(COOKIE_SECRET));
app.use(express.static('front/'));

//app.post('/*',validator.sanitisation);

app.use('/admin',adminRouter);
app.use('/user',userRouter);
app.use('/project',projectRouter);
app.use('/',function(req,res,next){
    res.sendFile('home.html', {root: 'front/'}); 
});

spdy.createServer(httpsOptions,app).listen(PORT);

console.log("Server Listening on portno -> " + PORT);
