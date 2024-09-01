const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dnajja0@gmail.com',
    pass: 'epcq iklw jjgv wspr'  // Use environment variables for security
  }
});

exports.sendFeedbackEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === 'POST' && req.body.email && req.body.message) {
      const { email, message } = req.body;
      const mailOptions = {
        from: `Xenontech App <noreply@yourdomain.com>`,
        to: 'admin@xenontech.com.au', 
        subject: `New Feedback from ${email}`, // Use email in the subject
        text: message
      };

      mailTransport.sendMail(mailOptions)
        .then(() => res.status(200).send({ success: true }))
        .catch(error => res.status(500).send({ error: error.toString() }));
    } else {
      res.status(400).send({ error: 'Invalid request' });
    }
  });
});
