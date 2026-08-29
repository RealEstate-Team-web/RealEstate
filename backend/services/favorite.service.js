const Favorite = require("../models/favorite.model");

/**
 * List all favorited properties for a user
 * @param {number|string} userId
 * @returns {Promise<Array>}
 */
async function getFavorites(userId) {
  const list = await Favorite.listByUser(userId);
  return list;
}

/**
 * Save a property as favorite for a user
 * @param {number|string} userId
 * @param {number|string} propertyId
 * @returns {Promise<Object>}
 */
async function addFavorite(userId, propertyId) {
  const existing = await Favorite.findFavorite(userId, propertyId);
  if (existing) {
    return {
      propertyId: Number(propertyId),
      favorited: true,
      message: "Property already saved in favorites",
    };
  }

  try {
    const favoriteId = await Favorite.create(userId, propertyId);
    return {
      favoriteId,
      propertyId: Number(propertyId),
      favorited: true,
    };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return {
        propertyId: Number(propertyId),
        favorited: true,
        message: "Property already saved in favorites",
      };
    }
    if (
      err.code === "ER_NO_REFERENCED_ROW_2" ||
      err.code === "ER_NO_REFERENCED_ROW"
    ) {
      const error = new Error("Property not found");
      error.status = 404;
      throw error;
    }
    const error = new Error("Failed to add property to favorites");
    error.status = 500;
    throw error;
  }
}

/**
 * Remove a property from favorites for a user
 * @param {number|string} userId
 * @param {number|string} propertyId
 * @returns {Promise<Object>}
 */
async function removeFavorite(userId, propertyId) {
  const affected = await Favorite.delete(userId, propertyId);
  return {
    propertyId: Number(propertyId),
    favorited: false,
    removed: affected > 0,
  };
}

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
