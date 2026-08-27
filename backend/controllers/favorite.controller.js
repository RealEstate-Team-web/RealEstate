const favoriteService = require("../services/favorite.service");

const getFavorites = async (req, res, next) => {
  try {
    const data = await favoriteService.getFavorites(req.user.id);
    res.status(200).json({
      success: true,
      message: "Favorites retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const data = await favoriteService.addFavorite(req.user.id, propertyId);
    res.status(201).json({
      success: true,
      message: "Property added to favorites",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const data = await favoriteService.removeFavorite(req.user.id, propertyId);
    res.status(200).json({
      success: true,
      message: "Property removed from favorites",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
