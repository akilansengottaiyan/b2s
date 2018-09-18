var express = require('express'),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan');
    config = require('./db/config');
    userRouter = require('./routes/userRouter');
    adminRouter = require('/routes/adminRouter')
    PORT = process.env.PORT;    
    app = express();

mongoose.connect(config.url);
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended:true }));
app.use(bodyparser.json);
app.listen(PORT);
app.use('/admin',adminRouter);
app.use('/user',userRouter);
console.log("Server Listening on " + PORT);
