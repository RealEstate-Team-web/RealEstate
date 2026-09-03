const userService = require("../services/user.service");
const { uploadToCloudinary } = require("../services/upload.service");

const getProfile = async (req, res, next) => {
  try {
    const data = await userService.getProfile(req.user.id);
    res.status(200).json({
      success: true,
      message: "Profile retrieved",
      data: { user: data },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const data = await userService.updateProfile(req.user.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
    });
    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: { user: data },
    });
  } catch (error) {
    next(error);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("Image is required");
      error.status = 400;
      return next(error);
    }

    const userId = req.user.id;
    const profileImageUrl = await uploadToCloudinary(req.file.buffer, {
      folder: `real-estate/profiles/${userId}`,
    });

    const data = await userService.uploadProfileImage(userId, profileImageUrl);
    res.status(200).json({
      success: true,
      message: "Profile image updated",
      data: { user: data, profileImageUrl },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
};