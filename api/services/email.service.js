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
