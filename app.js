require("dotenv").config(); // for process.env read
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();
const errorMiddleware = require("./middlewares/errorMiddlewares");

const PORT = process.env.PORT || 5005;

const router = require("./router/index");

app.use(express.json()); // express по умолчанию не работает с json
app.use(cookieParser()); //для работы res.cookie("refreshToken", userData.refreshToken, {});
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    // await sequelize.authenticate();
    // await sequelize.sync();
    // mongoose.set("strictQuery", false);
    // await mongoose.connect(process.env.DB_Mongo_URL);
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    console.log("Server started");
  } catch (e) {
    console.log(e);
  }
};

start();
