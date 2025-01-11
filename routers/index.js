const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const authentication = require("../middlewares/authentication");
const taskRouter = require("./task");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.use(authentication);
router.get("/me", AuthController.getMe);
router.use("/tasks", taskRouter);

module.exports = router;
