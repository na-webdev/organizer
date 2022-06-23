const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");
const EmailTemplate = require("email-templates");

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

  async sendEmailTo(email, subject, data, template) {
    const Template = path.join(__dirname, "../templates/email");

    data["baseUrl"] = process.env.BASE_URL;
    data["subject"] = subject;

    const emailTemplate = new EmailTemplate({ views: { root: Template } });
    const locals = {
      data,
    };

    const html = await emailTemplate.render(template, locals);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: html,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService(transporter);
