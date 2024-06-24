const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  logger: process.env.NODE_ENV !== "production",
  service: process.env.SMTP_EMAIL_SERVICE || null,
  host: process.env.SMPT_HOST || null,
  port: process.env.SMPT_PORT || null,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
