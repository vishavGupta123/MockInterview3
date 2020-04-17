const nodemailer = require("nodemailer");
const mailDetails = require("./mailDetails");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: mailDetails.user,
    pass: mailDetails.pass,
  },
});

module.exports = {
  transporter: transporter,
};
