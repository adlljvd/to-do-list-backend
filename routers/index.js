const express = require("express");
const router = express.Router();
const taskRouter = require("./task");
const categoryRouter = require("./category");
const AuthController = require("../controllers/authController");
const authentication = require("../middlewares/authentication");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.use(authentication);
router.get("/me", AuthController.getMe);
router.use("/tasks", taskRouter);
router.use("/categories", categoryRouter);

module.exports = router;
