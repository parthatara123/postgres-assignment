const { Op } = require("sequelize");
const { Restaurant } = require("../model/restaurantModel");
const { httpStatusCodes, httpErrorMsgs } = require("../util/constant");

// Importing all validation functions
const {
  isValidRequestBody,
  isValidProperty,
  isValidBoolean,
  isValidCost,
  isValidCuisineType
} = require("../util/validator");

// -------------------------------Regisering new Restaurant----------------------------------------------
const createRestaurant = async (req, res) => {
  try {
    const restaurantDetails = req.body;
    // Validation of request
    if (!isValidRequestBody(restaurantDetails)) {
      return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.INPUT_ERROR_MSG });
    }

    // Destructuring all properties of requst object for validation
    let {
      restaurantName,
      address,
      vegOnly,
      cuisineTypes,
      cost,
      isOpen
    } = restaurantDetails;

    if (!isValidProperty(restaurantName)) {
      return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.RESTAURANT_NAME_ERROR_MSG });
    }

    if (!isValidProperty(address)) {
      return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.ADDRESS_ERROR_MSG });
    }

    if (!isValidBoolean(vegOnly)) {
      return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.VEG_ONLY_ERROR_MSG });
    }

    if (!isValidCuisineType(cuisineTypes)) {
      return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.CUISINE_ERROR_MSG });
    }

    // Validaating each element of cuisineTypes array
    for (let cuisine of cuisineTypes) {
      if (typeof cuisine !== "string") {
        return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.CUISINE_ERROR_MSG });
      }
    }

    if (!isValidCost(cost)) {
      return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.COST_ERROR_MSG });
    }
    // isOpen is non required field, so if it is avaiolable in request object, validating it
    if (isOpen) {
      if (!isValidBoolean(isOpen)) {
        return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.IS_OPEN_ERROR_MSG });
      }
    }

    // Create record using sequilize create query
    const registerRestaurant = await Restaurant.create(restaurantDetails);

    res.status(httpStatusCodes.SUCCESSFULLY_CREATED).send({ status: true, data: registerRestaurant });
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER).send({ error: error.message });
  }
};

// -----------------------------------Filter query to find restaurants--------------------------------------------
const getRestaurants = async (req, res) => {
  try {
    const filter = req.body;

    // if filters are provided in request, then checking each fields of request object
    if (isValidRequestBody(filter)) {
      let { costFilter, isVegFilter, cuisineOrFilter, cuisineAndFilter } = filter;
      // creating filter object to use it in filter query
      const filters = [];

      // Validating each elements of cost filter array
      if (costFilter) {
        if (Array.isArray(costFilter)) {
          let obj = {};
          for (let items of costFilter) {
            if (!isValidCost(items)) {
              return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.COST_ERROR_MSG });
            }
          }
          // creating object and pushing it into filters aray
          obj["cost"] = costFilter;
          filters.push(obj);
        } else {
          if (!isValidCost(costFilter)) {
            return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.COST_ERROR_MSG });
          }
          // creating object and pushing it into filters aray

          obj["cost"] = costFilter;
          filters.push(obj);
        }
      }

      if (filters.hasOwnProperty("isVegFilter")) {
        if (!isValidBoolean(isVegFilter)) {
          return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.VEG_ONLY_ERROR_MSG });
        }
        // creating object and pushing it into filters aray
        let obj = {};
        obj["vegOnly"] = String(isVegFilter);
        filters.push(obj);
      }

      if (cuisineOrFilter) {
        if (isValidCuisineType(cuisineOrFilter)) {
          for (let item of cuisineOrFilter) {
            if (!isValidProperty(item)) {
              return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.CUISINE_ERROR_MSG });
            }
          }
          // creating object and pushing it into filters aray
          let obj = {};
          obj["cuisineTypes"] = cuisineOrFilter;
          filters.push(obj);
        } else {
          if (!isValidProperty(cuisineOrFilter)) {
            return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.CUISINE_ERROR_MSG });
          }
          // creating object and pushing it into filters aray
          let obj = {};
          obj["cuisineTypes"] = [cuisineOrFilter];
          filters.push(obj);
          // cuisineOrFilter = [cuisineOrFilter]
        }
      }

      if (cuisineAndFilter) {
        if (isValidCuisineType(cuisineAndFilter)) {
          for (let item of cuisineAndFilter) {
            if (!isValidProperty(item)) {
              return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.CUISINE_ERROR_MSG });
            }
          }
          // creating object and pushing it into filters aray
          let obj = {};
          obj["cuisineTypes"] = cuisineAndFilter;
          filters.push(obj);
        } else {
          if (!isValidProperty(cuisineAndFilter)) {
            return res.status(httpStatusCodes.BAD_REQUEST).send({ status: false, message: httpErrorMsgs.CUISINE_ERROR_MSG });
          }
          // creating object and pushing it into filters aray
          let obj = {};
          obj["cuisineTypes"] = [cuisineAndFilter];
          filters.push(obj);
        }
      }

      let condition;
      if (cuisineOrFilter) {
        condition = {
          [Op.contains]: cuisineOrFilter
        };
      } else if (cuisineAndFilter) {
        condition = cuisineAndFilter;
      }

      // find query to apply all filters
      const filteredRestaurants = await Restaurant.findAll({
        where: {
          [Op.and]: filters,
          cuisineTypes: condition
        }
      });

      if (filteredRestaurants.length === 0) {
        return res.status(httpStatusCodes.NOT_FOUND).send({ status: false, message: httpErrorMsgs.RESTAURANT_NOT_FOUND });
      }

      res.status(httpStatusCodes.SUCCESS).send({ status: true, count: filteredRestaurants.length, data: filteredRestaurants });
      // if no filters are given in request, sending all restaurants
    } else {
      const allRestaurants = await Restaurant.findAll();

      // If no data found by given filter
      if (allRestaurants.length === 0) {
        return res.status(httpStatusCodes.NOT_FOUND).send({ status: false, message: httpErrorMsgs.RESTAURANT_NOT_FOUND });
      }

      // Sending filtered restaurants data in response
      res.status(httpStatusCodes.SUCCESS).send({ status: true, count: allRestaurants.length, data: allRestaurants });
    }
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER).send({ error: error.message });
  }
};

module.exports = {
  createRestaurant,
  getRestaurants
};
