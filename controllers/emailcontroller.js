const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'cryptoproject43@gmail.com',
      pass: 'fhch ekvk vfbt czcd',
  },
});

exports.sendEmail = (req, res) => {
  const { recipient, subject, message } = req.body;

  const mailOptions = {
      from: 'cryptoproject43@gmail.com',
      to: recipient,
      subject,
      text: message,
  };


  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error(error);
          res.status(500).send('Error sending email');
      } else {
          console.log('Email sent: ' + info.response);
          
      }
  });
};
