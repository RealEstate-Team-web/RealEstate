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

  const favoriteId = await Favorite.create(userId, propertyId);
  return {
    favoriteId,
    propertyId: Number(propertyId),
    favorited: true,
  };
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
