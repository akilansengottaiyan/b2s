var express = require('express'),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan');
    config = require('./db/config');
    userRouter = require('./routes/user.routes');
    adminRouter = require('./routes/admin.routes')
    PORT = process.env.PORT;    
    app = express();

mongoose.connect(config.url,{useNewUrlParser:true});
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended:true }));
app.use(bodyparser.json());
app.listen(PORT);

app.use('/admin',adminRouter);
app.use('/user',userRouter);
app.use('/',function(req,res,next){
    res.status('200').send('WELCOME to B2S...');
});
console.log("Server Listening on " + PORT);
