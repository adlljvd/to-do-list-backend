const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");

router.get("/", CategoryController.getCategories);
router.post("/", CategoryController.addCategory);
router.put("/:name", CategoryController.updateCategory);
router.delete("/:name", CategoryController.deleteCategory);

module.exports = router;
