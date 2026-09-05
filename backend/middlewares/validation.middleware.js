const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9]{7,15}$/;
const hasUppercase = /[A-Z]/;
const hasLowercase = /[a-z]/;
const hasNumber = /[0-9]/;

function validationError(errors) {
  const error = new Error("Validation failed");
  error.status = 400;
  error.errors = errors;
  return error;
}

function validateCoreIdentity(body) {
  const errors = [];
  const { firstName, lastName, email, phone, password, role } = body || {};

  if (!firstName || !String(firstName).trim())
    errors.push("firstName is required");
  if (!lastName || !String(lastName).trim())
    errors.push("lastName is required");
  if (!email || !emailPattern.test(String(email).trim()))
    errors.push("email must be a valid email address");
  if (!phone || !phonePattern.test(String(phone).trim()))
    errors.push("phone is required and must be a valid phone number");
  if (!password || typeof password !== "string" || password.length < 8)
    errors.push("password must be at least 8 characters");
  if (typeof password === "string") {
    if (!hasUppercase.test(password))
      errors.push("password must contain at least one uppercase letter");
    if (!hasLowercase.test(password))
      errors.push("password must contain at least one lowercase letter");
    if (!hasNumber.test(password))
      errors.push("password must contain at least one number");
  }
  if (role && !["buyer", "agent"].includes(role))
    errors.push("role must be 'buyer' or 'agent'");

  return errors;
}

const validateRegister = (req, res, next) => {
  const errors = validateCoreIdentity(req.body);
  if (errors.length > 0) return next(validationError(errors));
  next();
};

const validateCompleteAgentProfile = (req, res, next) => {
  const errors = [];
  const { agencyName, licenseNumber, experience, officeAddress, bio } =
    req.body || {};

  if (!agencyName || !String(agencyName).trim())
    errors.push("agencyName is required");
  if (!licenseNumber || !String(licenseNumber).trim())
    errors.push("licenseNumber is required");
  else if (String(licenseNumber).trim().length > 50)
    errors.push("licenseNumber must be at most 50 characters");
  if (
    experience === undefined ||
    experience === null ||
    Number.isNaN(Number(experience)) ||
    Number(experience) < 0
  )
    errors.push("experience is required and must be a non-negative number");
  if (!officeAddress || !String(officeAddress).trim())
    errors.push("officeAddress is required");
  if (bio !== undefined && bio !== null && String(bio).trim()) {
    if (String(bio).trim().length < 20)
      errors.push("bio must be at least 20 characters");
    else if (String(bio).trim().length > 500)
      errors.push("bio must be at most 500 characters");
  }

  if (errors.length > 0) return next(validationError(errors));
  next();
};

const validateRegisterAgent = (req, res, next) => {
  const errors = validateCoreIdentity({ ...req.body, role: "buyer" });
  const { agencyName, licenseNumber, experience } = req.body || {};

  if (!agencyName || !String(agencyName).trim())
    errors.push("agencyName is required");
  if (!licenseNumber || !String(licenseNumber).trim())
    errors.push("licenseNumber is required");
  if (
    experience === undefined ||
    experience === null ||
    Number.isNaN(Number(experience)) ||
    Number(experience) < 0
  )
    errors.push("experience is required and must be a non-negative number");

  if (errors.length > 0) return next(validationError(errors));
  next();
};

const normalizeCategoryFields = (req) => {
  const body = req.body || {};
  if (typeof body.name === "string") {
    body.name = body.name.trim();
  }
  if (typeof body.description === "string") {
    body.description = body.description.trim();
  }
  return body;
};

const validateCreateCategory = (req, res, next) => {
  const errors = [];
  const { name, description } = normalizeCategoryFields(req);

  if (!name || typeof name !== "string" || !name.trim())
    errors.push("name is required");
  else if (name.trim().length > 100)
    errors.push("name must be at most 100 characters");
  if (
    description !== undefined &&
    description !== null &&
    (typeof description !== "string" || description.trim().length > 1000)
  )
    errors.push("description must be a string of at most 1000 characters");

  if (errors.length > 0) return next(validationError(errors));
  next();
};

const validateUpdateCategory = (req, res, next) => {
  const errors = [];
  const { name, description } = normalizeCategoryFields(req);

  const hasName = name !== undefined && name !== null;
  const hasDescription = description !== undefined && description !== null;

  if (!hasName && !hasDescription) {
    errors.push("at least one of name or description is required");
  }

  if (hasName) {
    if (typeof name !== "string" || !name.trim())
      errors.push("name must be a non-empty string");
    else if (name.trim().length > 100)
      errors.push("name must be at most 100 characters");
  }
  if (
    hasDescription &&
    (typeof description !== "string" || description.trim().length > 1000)
  )
    errors.push("description must be a string of at most 1000 characters");

  if (errors.length > 0) return next(validationError(errors));
  next();
};

const validateLogin = (req, res, next) => {
  const errors = [];
  const { email, password } = req.body || {};
  if (!email || !emailPattern.test(String(email).trim()))
    errors.push("email must be a valid email address");
  if (!password || !String(password)) errors.push("password is required");

  if (errors.length > 0) return next(validationError(errors));
  next();
};

const isValidPositiveBigInt = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "bigint")
    return false;
  const str = String(value);
  if (!/^[1-9]\d*$/.test(str)) return false;
  try {
    const val = BigInt(str);
    return val > 0n && val <= 18446744073709551615n;
  } catch {
    return false;
  }
};

const validateAddFavorite = (req, res, next) => {
  const errors = [];
  const { propertyId } = req.body || {};

  if (!isValidPositiveBigInt(propertyId)) {
    errors.push("propertyId is required and must be a valid positive integer");
  }

  if (errors.length > 0) return next(validationError(errors));
  next();
};

const makeIdParamValidator = (paramName, message) => (req, res, next) => {
  const value = (req.params || {})[paramName];

  if (!isValidPositiveBigInt(value)) {
    return next(validationError([message]));
  }

  next();
};

const validatePropertyIdParam = makeIdParamValidator(
  "propertyId",
  "propertyId parameter must be a valid positive integer",
);

const validateIdParam = makeIdParamValidator(
  "id",
  "id parameter must be a valid positive integer",
);

const PROPERTY_STATUSES = ["draft", "available", "sold", "rented"];
const PROPERTY_LISTING_TYPES = ["sale", "rent"];

const toOptionalNumber = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "number" && typeof value !== "string") return NaN;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const hasValue = (value) =>
  value !== undefined && value !== null && value !== "";

function validatePropertyInput(body, { partial = false } = {}) {
  const errors = [];
  const {
    title,
    description,
    categoryId,
    listingType,
    price,
    bedrooms,
    bathrooms,
    parkingSpaces,
    area,
    country,
    city,
    address,
    latitude,
    longitude,
    status,
    amenities,
  } = body || {};

  const required = !partial;
  const shouldCheck = (value) =>
    required || hasValue(value) || (partial && (value === "" || value === null));

  if (partial) {
    const provided =
      title !== undefined ||
      description !== undefined ||
      categoryId !== undefined ||
      listingType !== undefined ||
      price !== undefined ||
      bedrooms !== undefined ||
      bathrooms !== undefined ||
      parkingSpaces !== undefined ||
      area !== undefined ||
      country !== undefined ||
      city !== undefined ||
      address !== undefined ||
      latitude !== undefined ||
      longitude !== undefined ||
      status !== undefined ||
      amenities !== undefined;

    if (!provided) {
      errors.push("at least one property field is required for update");
    }
  }

  if (shouldCheck(title)) {
    if (typeof title !== "string" || !title.trim()) {
      errors.push("title is required");
    } else if (title.trim().length > 200) {
      errors.push("title must be at most 200 characters");
    }
  }

  if (shouldCheck(description)) {
    if (typeof description !== "string" || !description.trim()) {
      errors.push("description is required");
    } else if (description.trim().length > 10000) {
      errors.push("description must be at most 10000 characters");
    }
  }

  if (shouldCheck(categoryId)) {
    if (!isValidPositiveBigInt(categoryId)) {
      errors.push("categoryId is required and must be a valid positive integer");
    }
  }

  if (shouldCheck(listingType)) {
    if (!PROPERTY_LISTING_TYPES.includes(listingType)) {
      errors.push("listingType must be 'sale' or 'rent'");
    }
  }

  if (shouldCheck(price)) {
    const priceValue = toOptionalNumber(price);
    if (priceValue === undefined || Number.isNaN(priceValue) || priceValue <= 0) {
      errors.push("price is required and must be a positive number");
    } else if (priceValue > 100000000000000) {
      errors.push("price is too large");
    }
  }

  const nonNegativeInteger = (fieldName, value) => {
    if (!hasValue(value)) return;
    if (typeof value !== "number" && typeof value !== "string") {
      errors.push(`${fieldName} must be an integer between 0 and 1000`);
      return;
    }
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 1000) {
      errors.push(`${fieldName} must be an integer between 0 and 1000`);
    }
  };

  nonNegativeInteger("bedrooms", bedrooms);
  nonNegativeInteger("bathrooms", bathrooms);
  nonNegativeInteger("parkingSpaces", parkingSpaces);

  if (area !== undefined && area !== null) {
    if (area === "") {
      errors.push("area must be a positive number no larger than 10,000,000");
    } else {
      const areaValue = toOptionalNumber(area);
      if (Number.isNaN(areaValue) || areaValue <= 0 || areaValue > 10000000) {
        errors.push("area must be a positive number no larger than 10,000,000");
      }
    }
  }

  if (shouldCheck(country)) {
    if (typeof country !== "string" || !country.trim()) {
      errors.push("country is required");
    } else if (country.trim().length > 100) {
      errors.push("country must be at most 100 characters");
    }
  }

  if (shouldCheck(city)) {
    if (typeof city !== "string" || !city.trim()) {
      errors.push("city is required");
    } else if (city.trim().length > 100) {
      errors.push("city must be at most 100 characters");
    }
  }

  if (hasValue(address)) {
    if (typeof address !== "string" || address.trim().length > 255) {
      errors.push("address must be a string of at most 255 characters");
    }
  }

  if (latitude !== undefined && latitude !== null) {
    if (latitude === "") {
      errors.push("latitude must be between -90 and 90");
    } else {
      const latitudeValue = toOptionalNumber(latitude);
      if (Number.isNaN(latitudeValue) || latitudeValue < -90 || latitudeValue > 90) {
        errors.push("latitude must be between -90 and 90");
      }
    }
  }

  if (longitude !== undefined && longitude !== null) {
    if (longitude === "") {
      errors.push("longitude must be between -180 and 180");
    } else {
      const longitudeValue = toOptionalNumber(longitude);
      if (
        Number.isNaN(longitudeValue) ||
        longitudeValue < -180 ||
        longitudeValue > 180
      ) {
        errors.push("longitude must be between -180 and 180");
      }
    }
  }

  if (status !== undefined) {
    if (!PROPERTY_STATUSES.includes(status)) {
      errors.push("status must be one of 'draft', 'available', 'sold', 'rented'");
    }
  }

  if (amenities !== undefined && amenities !== null) {
    if (!Array.isArray(amenities)) {
      errors.push("amenities must be an array of amenity names");
    } else if (amenities.length > 50) {
      errors.push("amenities must contain at most 50 items");
    } else {
      const seen = new Set();
      for (const amenity of amenities) {
        if (typeof amenity !== "string" || !amenity.trim()) {
          errors.push("each amenity must be a non-empty string");
          break;
        }
        if (amenity.trim().length > 100) {
          errors.push("each amenity must be at most 100 characters");
          break;
        }
        if (seen.has(amenity.trim().toLowerCase())) {
          errors.push("amenities must not contain duplicate names");
          break;
        }
        seen.add(amenity.trim().toLowerCase());
      }
    }
  }

  return errors;
}

const validateCreateProperty = (req, res, next) => {
  const errors = validatePropertyInput(req.body, { partial: false });
  if (errors.length > 0) return next(validationError(errors));
  next();
};

const validateUpdateProperty = (req, res, next) => {
  const errors = validatePropertyInput(req.body, { partial: true });
  if (errors.length > 0) return next(validationError(errors));
  next();
};

const validateForgotPassword = (req, res, next) => {
  const errors = [];
  const { email } = req.body || {};
  if (!email || !emailPattern.test(String(email).trim()))
    errors.push("email must be a valid email address");

  if (errors.length > 0) return next(validationError(errors));
  next();
};

const validateResetPassword = (req, res, next) => {
  const errors = [];
  const { token, password } = req.body || {};

  if (!token || !String(token).trim()) errors.push("token is required");
  if (typeof password !== "string" || password.length < 8) {
    errors.push("password must be at least 8 characters");
  } else {
    if (!hasUppercase.test(password))
      errors.push("password must contain at least one uppercase letter");
    if (!hasLowercase.test(password))
      errors.push("password must contain at least one lowercase letter");
    if (!hasNumber.test(password))
      errors.push("password must contain at least one number");
  }

  if (errors.length > 0) return next(validationError(errors));
  next();
};

const datePattern = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

const isValidCalendarDate = (dateStr) => {
  if (typeof dateStr !== "string") return false;
  const str = dateStr.trim();
  if (!datePattern.test(str)) return false;
  const [yearStr, monthStr, dayStr] = str.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const d = new Date(Date.UTC(year, month - 1, day));
  return (
    d.getUTCFullYear() === year &&
    d.getUTCMonth() === month - 1 &&
    d.getUTCDate() === day
  );
};

const validateBookVisit = (req, res, next) => {
  const errors = [];
  const { propertyId, visitDate, visitTime, notes } = req.body || {};

  if (!isValidPositiveBigInt(propertyId)) {
    errors.push("propertyId is required and must be a valid positive integer");
  }

  if (!visitDate || !isValidCalendarDate(visitDate)) {
    errors.push("visitDate is required and must be a valid calendar date in YYYY-MM-DD format");
  }

  if (!visitTime || !timePattern.test(String(visitTime).trim())) {
    errors.push("visitTime is required and must be a valid time in HH:MM format");
  }

  if (notes !== undefined && notes !== null && typeof notes !== "string") {
    errors.push("notes must be a string");
  } else if (typeof notes === "string" && notes.length > 1000) {
    errors.push("notes cannot exceed 1000 characters");
  }

  if (errors.length > 0) return next(validationError(errors));
  next();
};

const validateVisitIdParam = (req, res, next) => {
  const { id } = req.params || {};

  if (!isValidPositiveBigInt(id)) {
    return next(
      validationError(["Visit ID parameter must be a valid positive integer"]),
    );
  }

  next();
};

const validateRescheduleVisit = (req, res, next) => {
  const errors = [];
  const { visitDate, visitTime, notes } = req.body || {};

  if (!visitDate || !isValidCalendarDate(visitDate)) {
    errors.push("visitDate is required and must be a valid calendar date in YYYY-MM-DD format");
  }

  if (!visitTime || !timePattern.test(String(visitTime).trim())) {
    errors.push("visitTime is required and must be a valid time in HH:MM format");
  }

  if (notes !== undefined && notes !== null && typeof notes !== "string") {
    errors.push("notes must be a string");
  } else if (typeof notes === "string" && notes.length > 1000) {
    errors.push("notes cannot exceed 1000 characters");
  }

  if (errors.length > 0) return next(validationError(errors));
  next();
};

const validateSubmitInquiry = (req, res, next) => {
  const errors = [];
  const { propertyId, name, email, phone, message } = req.body || {};

  if (!isValidPositiveBigInt(propertyId)) {
    errors.push("propertyId is required and must be a valid positive integer");
  }

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("name is required and must be a string of at least 2 characters");
  } else if (name.trim().length > 150) {
    errors.push("name cannot exceed 150 characters");
  }

  if (!email || typeof email !== "string" || !emailPattern.test(email.trim())) {
    errors.push("email is required and must be a valid email address string");
  }

  if (phone !== undefined && phone !== null && phone !== "") {
    if (typeof phone !== "string" || !phonePattern.test(phone.trim())) {
      errors.push("phone must be a valid phone number string format");
    }
  }

  if (!message || typeof message !== "string" || message.trim().length < 5) {
    errors.push("message is required and must be a string of at least 5 characters");
  } else if (message.trim().length > 5000) {
    errors.push("message cannot exceed 5000 characters");
  }

  if (errors.length > 0) return next(validationError(errors));
  next();
};

const validateInquiryMessage = (req, res, next) => {
  const errors = [];
  const { message } = req.body || {};

  if (!message || typeof message !== "string" || message.trim().length < 1) {
    errors.push("message is required and must not be empty");
  } else if (message.trim().length > 5000) {
    errors.push("message cannot exceed 5000 characters");
  }

  if (errors.length > 0) return next(validationError(errors));
  next();
};

const validateInquiryIdParam = (req, res, next) => {
  const { id } = req.params || {};

  if (!isValidPositiveBigInt(id)) {
    return next(
      validationError(["Inquiry ID parameter must be a valid positive integer"]),
    );
  }

  next();
};

const validateUpdateProfile = (req, res, next) => {
  const errors = [];
  const { firstName, lastName, phone } = req.body || {};

  if (firstName !== undefined && firstName !== null && String(firstName).trim() !== '') {
    if (typeof firstName !== "string")
      errors.push("firstName must be a non-empty string");
    else if (String(firstName).trim().length > 100)
      errors.push("firstName must be at most 100 characters");
  }
  if (lastName !== undefined && lastName !== null && String(lastName).trim() !== '') {
    if (typeof lastName !== "string")
      errors.push("lastName must be a non-empty string");
    else if (String(lastName).trim().length > 100)
      errors.push("lastName must be at most 100 characters");
  }
  if (phone !== undefined && phone !== null && String(phone).trim() !== '') {
    if (!phonePattern.test(String(phone).trim()))
      errors.push("phone must be a valid phone number");
  }

  if (errors.length > 0) return next(validationError(errors));
  next();
};

const validateChangePassword = (req, res, next) => {
  const errors = [];
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || typeof currentPassword !== "string")
    errors.push("currentPassword is required");

  if (typeof newPassword !== "string" || newPassword.length < 8) {
    errors.push("newPassword must be at least 8 characters");
  } else {
    if (!hasUppercase.test(newPassword))
      errors.push("newPassword must contain at least one uppercase letter");
    if (!hasLowercase.test(newPassword))
      errors.push("newPassword must contain at least one lowercase letter");
    if (!hasNumber.test(newPassword))
      errors.push("newPassword must contain at least one number");
  }

  if (errors.length > 0) return next(validationError(errors));
  next();
};

module.exports = {
  PROPERTY_STATUSES,
  PROPERTY_LISTING_TYPES,
  validateRegister,
  validateRegisterAgent,
  validateCompleteAgentProfile,
  validateLogin,
  validateCreateCategory,
  validateUpdateCategory,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
  validateChangePassword,
  validateAddFavorite,
  validatePropertyIdParam,
  validateIdParam,
  validateCreateProperty,
  validateUpdateProperty,
  validateBookVisit,
  validateVisitIdParam,
  validateRescheduleVisit,
  validateSubmitInquiry,
  validateInquiryMessage,
  validateInquiryIdParam,
};
