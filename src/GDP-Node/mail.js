
function sendMail(subject = 'Hello', to = 'pravalikakawali@gmail.com', body = 'Cool App'){

    var api_key = 'key-a6e22d1d1a420c73fc2dcfb419e02c69';
    var domain = 'sandbox171e471266b34315b10fc87cb8cbb3a4.mailgun.org';
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
     
    var data = {
      from: 'Mail gun Reporter <postmaster@sandbox171e471266b34315b10fc87cb8cbb3a4.mailgun.org>',
      to: to,
      subject: subject,
      text: body
    };
     
    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
};

module.exports = sendMail;