const httpStatusCodes = {
  SUCCESS: 200,
  SUCCESSFULLY_CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500
};

const httpErrorMsgs = {
  INPUT_ERROR_MSG: "Restaurant data is required for registration",
  CUISINE_ERROR_MSG: "Cuisine types are required and must be an array of strings",
  VEG_ONLY_ERROR_MSG: `Veg only is required and must be a boolean`,
  IS_OPEN_ERROR_MSG: "Is open option must be a boolean",
  COST_ERROR_MSG: "Cost is required and must be from these options : Low, Medium, High ",
  ADDRESS_ERROR_MSG: "Address is required and must be provided in valid string format",
  RESTAURANT_NAME_ERROR_MSG: "Restaurant name is required and must be provided in valid string format",
  RESTAURANT_NOT_FOUND: "Restaurants not found"
};

module.exports = {
  httpStatusCodes,
  httpErrorMsgs
};
