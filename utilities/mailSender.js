var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'akilan0306@gmail.com',
    pass: 'azbycxdw0306@'
  }
});

var sendEmail = function(to, subject, body){
var mailOptions = {
  from: 'akilan0306@gmail.com',
  to: to,
  subject: subject,
  text: body
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
};

module.exports = sendEmail;