var xoauth2 = require('xoauth2');
var nodemailer = require('nodemailer');
var request = require('request');
var sendmailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    type: 'OAuth2',
    user: 'noreply.northwest@gmail.com',
    clientId: '885674907192-ldp4850vdd1s6m3l1m3ne71vpb4jka7g.apps.googleusercontent.com',
    clientSecret: 'V9V-WDu4oQf_6SjjMq7KtJoq',
    refreshToken: '1/_AilrKdxd5jTlCN0RIxu_AFPujtxDxgwqUHGBYomzAw',
    accessToken: 'ya29.GltFBhwDfQOfwyyB5OjkBZ9caWERDuj9FHrQiUBfbu4p0_jBEMr7BWQyErDraHmkBBxHcYtfyHsKQXAve1wyPKDvw0nd8W2NTtBigB692LfXDbph23g75cfwlOuz',
    // type: 'OAuth2',
    // user: process.env.MAIL_USER,
    // clientId: process.env.MAIL_CLIENTID,
    // clientSecret: process.env.MAIL_CLIENTSECRET,
    // refreshToken: process.env.MAIL_REFRESHTOKEN,
    // accessToken: process.env.MAIL_ACCESSTOKEN,
  }
})

sendmailer.on('token', function (token) {
  console.log('New token for %s: %s', token.user, token.accessToken);
});

module.exports = {
  sendEmail: function (toEmail, subjectEmail, htmlEmail) {
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
      }
        console.log('Mail sent successfully');
        console.log(response['response'])
        sendmailer.close();
        checksSentMail = true
    });
    var check = checksSentMail;
    return check
  }
};