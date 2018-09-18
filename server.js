var express = require('express'),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan');
    config = require('./db/config');
    PORT = process.env.PORT;    
    app = express();

mongoose.connect(config.url);
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended:true }));
app.use(bodyparser.json);
app.listen(PORT);
console.log("Server Listening on " + PORT);
    