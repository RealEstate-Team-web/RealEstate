const authService = require("../services/auth.service");
const { uploadToCloudinary } = require("../services/upload.service");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;
    const result = await authService.register({
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: result.user,
      ...(result.token ? { token: result.token } : {}),
    });
  } catch (error) {
    next(error);
  }
};

const registerAgent = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      agencyName,
      licenseNumber,
      experience,
    } = req.body;
    const user = await authService.registerAgent({
      firstName,
      lastName,
      email,
      phone,
      password,
      agencyName,
      licenseNumber,
      experienceYears: experience,
    });

    res.status(201).json({
      success: true,
      message: "Registration submitted. Waiting for admin approval.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

const completeAgentProfile = async (req, res, next) => {
  try {
    if (req.user.role !== "agent") {
      const error = new Error("Only agents can complete an agent profile");
      error.status = 403;
      return next(error);
    }

    const { agencyName, licenseNumber, experience, officeAddress, bio } =
      req.body;

    let profileImageUrl = null;
    if (req.file) {
      profileImageUrl = await uploadToCloudinary(req.file.buffer, {
        folder: "agent-profile",
      });
    }

    const user = await authService.completeAgentProfile({
      userId: req.user.id,
      agencyName,
      licenseNumber,
      experience: Number(experience),
      officeAddress,
      bio,
      profileImageUrl,
    });

    res.status(200).json({
      success: true,
      message: "Agent profile submitted. Waiting for admin approval.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const me = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Current user",
    data: { user: req.user },
  });
};

const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword,
    );
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, registerAgent, login, logout, completeAgentProfile, me, changePassword };
