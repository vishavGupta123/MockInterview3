const nodeMailer = require("../config/nodemailer");

exports.forgetPassword = () => {
  console.log("inside forget password");

  nodeMailer.transporter.sendMail(
    {
      from: "vishav@codingninjas.in",
      to: "cap@codingninjas.in",
      subject: "reset your password",
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }
      console.log("message sent", info);
      return;
    }
  );
};
