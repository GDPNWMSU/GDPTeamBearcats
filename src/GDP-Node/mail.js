
function sendMail(subject = 'Hello', to = 'rajasrikar2010@gmail.com', body = 'Cool App'){

    var api_key = 'key-018f1c90c0902cf145d3bc023b2cda30';
    var domain = 'sandbox5445b14231524e53b22a6cb28a5190ad.mailgun.org';
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
     
    var data = {
      from: 'Northwest reporter <postmaster@sandbox171e471266b34315b10fc87cb8cbb3a4.mailgun.org>',
      to: to,
      subject: subject,
      text: body
    };
     
    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
};

module.exports = sendMail;