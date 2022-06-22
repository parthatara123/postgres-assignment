const sequelize = require("../database/database");
const Sequelize = require("sequelize");


//Creating schema
const Restaurant = sequelize.define(
  "Restaurants",
  {
    restaurant_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    restaurantName: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    vegOnly: {
      type: Sequelize.STRING,
    },
    cost: {
      type: Sequelize.ENUM,
      values: ["Low", "Medium", "High"],
    },
    cuisineTypes: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    isOpen: {
      type: Sequelize.BOOLEAN,
    },
  },
  { timestamps: true }
);

module.exports = { Restaurant, sequelize };
