const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

class EmailService {
  constructor(transporter) {
    this.transporter = transporter;
  }

  async sendConfirmationEmail(name, email, confirmationToken) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirm your account",
      html: `<h1>Organizer</h1>
      <h4>Hello ${name}</h4>
      <p>Please confirm your account by clicking the link below:</p>
      <a href="${process.env.BASE_URL}/confirm/${confirmationToken}">Confirm</a>`,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService(transporter);
