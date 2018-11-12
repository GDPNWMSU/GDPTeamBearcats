var xoauth2 = require('xoauth2');
var nodemailer = require('nodemailer');
var request = require('request');
var sendmailer = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true, // use SSL
  auth: {
    type: process.env.MAIL_AUTH_TYPE,
    user: process.env.MAIL_USER,
    clientId: process.env.MAIL_CLIENTID,
    clientSecret: process.env.MAIL_CLIENTSECRET,
    refreshToken: process.env.MAIL_REFRESHTOKEN,
    accessToken: process.env.MAIL_ACCESSTOKEN,
  }
})

sendmailer.on('token', function (token) {
  console.log('New token for %s: %s', token.user, token.accessToken);
});

module.exports = {
  sendEmail: function (callingClass, toEmail, subjectEmail, htmlEmail, res) {
    var mailOptions = {
      from: 'Northwest reporter <noreply.northwest@gmail.com>',
      to: toEmail,
      subject: subjectEmail,
      html: htmlEmail,
    };
    console.log('Call back function check')
    var checksSentMail = false;
    sendmailer.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.log('Mail not sent successfully');
        console.log(error)
        console.log(JSON.stringify(error))
        checksSentMail = false;
        if (callingClass == "addUsers") {
          return res.render('manage', {
            title: 'Internal error',
            status: false,
            message: 'Error occured while adding user!',
            username: req.session.user.email,
            firstName: req.session.user.firstName,
          })
        }
        return res.render('forgot_password', { title: 'Forgot Password', 'message': 'Error occured while sending email' });
      }
      console.log('Mail sent successfully');
      console.log(response['response'])
      // res.send(true);
      if (callingClass == "forgotPass") {
        return res.render('forgot_password', { title: 'Forgot Password', 'message': 'Reset Password link sent to your mail' });
      } else if(callingClass=="addUsers"){
        return res.send({
          status: true,
          message: 'User account created and password link mailed to new user!'
        })
      }
      sendmailer.close();
      checksSentMail = true
    });
    // var check = checksSentMail;
    // return check
  }
};