const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;
    const user = await authService.register({
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
      user,
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

const me = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Current user",
    data: { user: req.user },
  });
};

module.exports = { register, registerAgent, login, logout, me };
