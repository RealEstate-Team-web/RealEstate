// Normalize a property's primary image source to a URL string.
// The property API returns images as objects ({ imageUrl, publicId, sortOrder, isCover }),
// but legacy data may be a string or { url }. This helper handles all shapes.
export const getPropertyImageUrl = (property, fallback = "") => {
  if (!property) return fallback;

  const legacy =
    property.image || property.imageUrl || property.coverImage || property.cover_image || property.image_url;
  if (typeof legacy === "string") return legacy;

  const items = Array.isArray(property.images) ? property.images : [property.images];
  for (const item of items) {
    if (typeof item === "string" && item) return item;
    if (item && typeof item === "object") {
      if (typeof item.imageUrl === "string" && item.imageUrl) return item.imageUrl;
      if (typeof item.url === "string" && item.url) return item.url;
    }
  }

  return fallback;
};

// Build a flat array of image URL strings from a property. Used by galleries/thumbnails.
export const getPropertyImageList = (property) => {
  // 1) Try the array form first (preserves multi-image galleries)
  const base = Array.isArray(property?.images) ? property.images : [];
  const list = base
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item.imageUrl === "string") return item.imageUrl;
      if (item && typeof item.url === "string") return item.url;
      return "";
    })
    .filter(Boolean);
  if (list.length > 0) return list;

  // 2) Fall back to the same single-URL chain as getPropertyImageUrl, wrapped as a 1-element list
  const single = getPropertyImageUrl(property);
  return single ? [single] : [];
};
