const passwordResetService = require("../services/passwordReset.service");

const forgot = async (req, res, next) => {
  try {
    await passwordResetService.requestReset(req.body.email);
    res
      .status(200)
      .json({
        success: true,
        message:
          "If an account exists for that email, a reset link has been sent.",
      });
  } catch (error) {
    next(error);
  }
};

const reset = async (req, res, next) => {
  try {
    await passwordResetService.resetPassword(req.body.token, req.body.password);
    res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = { forgot, reset };
