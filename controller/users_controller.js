const User = require("../model/user");
const passport = require("passport");
const forgetPasswordMailer = require("../mailers/forgetPasswordMailer");
const ResetPassword = require("../model/resetPassword");
const nodeMailer = require("../config/nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
module.exports.update = function (req, res) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log(req.isAuthenticated());
    console.log(req.user);
    User.findOne({ email: req.user.email }, function (err, user) {
      if (!user) {
        console.log("what user");
      }
      console.log(user);
      return res.render("update_password", {
        profile_user: user,
      });
    });
  } else {
    return res.redirect("/users/signIn");
  }
};
module.exports.resetPassword = function (req, res) {
  return res.render("forgetPasswordFirst");
};
module.exports.updatePassword = async function (req, res) {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.redirect("back");
  } else {
    user.password = req.body.newPassword;
    user.save();
    console.log("password successfully updated");
    return res.redirect("back");
  }
};
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/update");
  }
  return res.render("user_sign_in", {});
};

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/update");
  }
  return res.render("user_sign_up", {});
};

module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Password and confirmPassword did not match");
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding the user in signing up");
      return;
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating user while signing up");
          return;
        }

        return res.redirect("/users/signIn");
      });
    } else {
      console.log("You are already a member");
      return res.redirect("/users/signIn");
    }
  });
};

module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/users/update");
};

module.exports.destroySession = function (req, res) {
  console.log("*** hey");
  req.flash("success", "You have logged out");
  req.logout();

  return res.redirect("/");
};

module.exports.generateResetLink = function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user) {
      console.log("Error in finding the user inside the database");
      return;
    }

    token = crypto.randomBytes(32).toString("hex");

    ResetPassword.create(
      {
        user: user.id,
        accessToken: token,
      },
      function (err, item) {
        if (!item) {
          console.log("error in creating a new password");
        }

        nodeMailer.transporter.sendMail(
          {
            from: "vishav@codingninjas.in",
            to: user.email,
            subject: "reset password link",
            html:
              '<p>Click <a href="http://localhost:8000/users/resetPasswordForm/' +
              token +
              '">here</a> to reset your password</p>',
          },
          (err, info) => {
            if (err) {
              console.log("error in sending the mail");
              return;
            }
            console.log("Successfull", info);
            return res.redirect("/");
          }
        );
      }
    );
  });
};
module.exports.resetPasswordForm = function (req, res) {
  console.log(req.params.token);
  return res.render("forgetPasswordForm", {
    token: req.params.token,
  });
};
module.exports.changingThePassword = function (req, res) {
  console.log(req.params.token);
  let token = req.params.token;
  ResetPassword.findOne({ accessToken: req.params.token }, function (
    err,
    resetPassword
  ) {
    if (err) {
      console.log("error in finding the access token", err);
      return;
    }
    console.log(resetPassword);
    User.findById(resetPassword.user, function (err, user) {
      if (err) {
        console.log("error in finding the user ", err);
        return;
      }
      user.password = req.body.password;
      user.save();
      return res.redirect("/users/signIn");
    });
  });
};
