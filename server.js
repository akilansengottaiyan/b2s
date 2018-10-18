var express = require('express'),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan');
    helmet = require('helmet');
    compress = require('compression');
    config = require('./app/db/config');
    userRouter = require('./app/routes/user.routes');
    adminRouter = require('./app/routes/admin.routes');
    projectRouter = require('./app/routes/project.routes');
    PORT = process.env.PORT;    
    app = express();

mongoose.connect(config.url,{useNewUrlParser:true});
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended:true }));
app.use(bodyparser.json());
app.use(helmet());
app.use(compress());
app.listen(PORT);
app.use(express.static('front/'));
app.use('/admin',adminRouter);
app.use('/user',userRouter);
app.use('/project',projectRouter);
app.use('/',function(req,res,next){
    res.sendFile('home.html', {root: 'front/'}); 
});
console.log("Server Listening on " + PORT);
