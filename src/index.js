const express = require("express");
const env = require("dotenv").config();
const route = require("./route/route");
const sequelize = require("./database/database");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// sequelize
// .authenticate()
// .then(() => console.log("DB is connected..."))
// .catch((err) => console.log(err));

sequelize.sync();

app.use("/", route);

app.listen(process.env.PORT, () => {
    console.log(`Express app is running on ${
        process.env.PORT
    }`);
});
