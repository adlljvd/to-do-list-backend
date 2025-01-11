const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/taskController");
const authorization = require("../middlewares/authorization");

router.get("/", TaskController.getTasks);
router.post("/", TaskController.createTask);
router.get("/:id", authorization, TaskController.getTaskById);
router.put("/:id", authorization, TaskController.updateTask);
router.delete("/:id", authorization, TaskController.deleteTask);

module.exports = router;
