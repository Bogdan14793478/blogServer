const Router = require("express");

const router = new Router();

const userRoute = require("./userRouter");

router.use("/", userRoute);

module.exports = router;
