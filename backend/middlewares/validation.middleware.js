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
  if (!password || String(password).length < 8)
    errors.push("password must be at least 8 characters");
  if (password && !hasUppercase.test(password))
    errors.push("password must contain at least one uppercase letter");
  if (password && !hasLowercase.test(password))
    errors.push("password must contain at least one lowercase letter");
  if (password && !hasNumber.test(password))
    errors.push("password must contain at least one number");
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

module.exports = {
  validateRegister,
  validateRegisterAgent,
  validateCompleteAgentProfile,
  validateLogin,
  validateCreateCategory,
  validateUpdateCategory,
};
