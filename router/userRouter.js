const Router = require("express").Router;
const userController = require("../controllers/userController");
const { body } = require("express-validator");
const router = new Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 20 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/users", userController.getUser); //get refresh token

module.exports = router;
