var sendResponse = function(res, result){
    res.status(result.status).send(result.body);
 }
 module.exports = sendResponse;