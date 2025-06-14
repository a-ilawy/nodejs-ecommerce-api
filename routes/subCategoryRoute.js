const express = require("express");

const {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../services/subCategoryService");
const {
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
  createSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const {
  setCategoryIDToSubCategoryBodyReq,
  createFilterObj,
} = require("../middlewares/addDataToReqMiddleware");
const {
  getCategoryValidator,
} = require("../utils/validators/categoryValidators");

// mergeParams: allow us to access parameters on other routers
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getSubCategories)
  .post(
    setCategoryIDToSubCategoryBodyReq,
    createSubCategoryValidator,
    createSubCategory
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
