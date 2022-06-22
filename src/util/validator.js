const enumOfCost = ["Low", "Medium", "High"];

// Validating request body
const isValidRequestBody = (value) => {
  if (Object.keys(value).length > 0)
    return true;
};

// Validating properties which must be string
const isValidProperty = (value) => {
  if (typeof value === "string" && value.trim().length > 0)
    return true;
};

// Validating properties which must be string
const isValidBoolean = (value) => {
  if (typeof value === "boolean") {
    return true;
  }
};

// Validating properties which must be array
const isValidCuisineType = (value) => {
  if (Array.isArray(value) === true) {
    return true;
  }
};

// Validating properties which must be boolean
const isValidCost = (value) => {
  if (enumOfCost.includes(value)) {
    return true;
  }
};


module.exports = {
  isValidRequestBody,
  isValidProperty,
  isValidBoolean,
  isValidCost,
  isValidCuisineType
};
