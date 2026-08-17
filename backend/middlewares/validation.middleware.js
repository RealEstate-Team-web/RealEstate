const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s()]{10,13}$/;

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
  if (role && role !== "buyer") errors.push("role must be 'buyer'");

  return errors;
}

const validateRegister = (req, res, next) => {
  const errors = validateCoreIdentity(req.body);
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

const validateLogin = (req, res, next) => {
  const errors = [];
  const { email, password } = req.body || {};
  if (!email || !emailPattern.test(String(email).trim()))
    errors.push("email must be a valid email address");
  if (!password || !String(password)) errors.push("password is required");

  if (errors.length > 0) return next(validationError(errors));
  next();
};

module.exports = { validateRegister, validateRegisterAgent, validateLogin };
