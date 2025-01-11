const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");
const authorization = require("../middlewares/authorization");

router.get("/", CategoryController.getCategories);
router.post("/", authorization, CategoryController.addCategory);
router.put("/:name", authorization, CategoryController.updateCategory);
router.delete("/:name", authorization, CategoryController.deleteCategory);

module.exports = router;
