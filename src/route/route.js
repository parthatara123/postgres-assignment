const express = require("express");
const router = express.Router();
const Restaurant = require("../controller/controller");


// Various APIs
router.post("/create", Restaurant.createRestaurant);
router.get("/restaurant", Restaurant.getRestaurants);

module.exports = router;
