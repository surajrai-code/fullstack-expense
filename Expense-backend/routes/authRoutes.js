const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  getUserById
} = require("../controller/authController");

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

// GET user by ID
router.get('user/:userId', getUserById);
// Forget password route
router.post("/forget-password", forgetPassword);

// Reset password route
router.route("/reset-password/:token")
  .get((req, res) => {
    res.render('reset-password-form', { token: req.params.token });
  })
  .post(resetPassword);

module.exports = router;
