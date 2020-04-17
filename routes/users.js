const express = require("express");
const passport = require("passport");
const router = express.Router();
const userController = require("../controller/users_controller");

router.get("/signIn", userController.signIn);
router.get("/signUp", userController.signUp);
router.post("/create", userController.create);
router.post(
  "/createSession",
  passport.authenticate("local", { failureRedirect: "/users/signIn" }),
  userController.createSession
);

router.get("/update", userController.update);
router.get("/signOut", userController.destroySession);
router.post("/updatePassword", userController.updatePassword);
router.get("/forgetPassword", userController.resetPassword);
router.post("/generateResetLink", userController.generateResetLink);
router.get("/resetPasswordForm/:token", userController.resetPasswordForm);
router.post("/resetpassword/:token", userController.changingThePassword);
module.exports = router;
