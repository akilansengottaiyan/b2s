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
  html: body
};

transporter.sendMail(mailOptions).then( info => {
    console.log('Email sent: ' + info.response);
}).catch(err => {
  console.log(err);
})
}
module.exports = sendEmail;

