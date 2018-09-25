var sendResponse = function(res, status, body){
    res.status(status).send(body);
 }
 module.exports = sendResponse;