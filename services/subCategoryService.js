const SubCategoryModel = require("../models/subCategory");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlersFactory");
// @desc Get list of subCategory
// @route GET /api/v1/subCategories
// @access Public
exports.getSubCategories = getAll(SubCategoryModel)

// @desc Get specific subCategory by id
// @route GET /api/v1/subCategories/:id
// @access Public
exports.getSubCategory = getOne(SubCategoryModel)
// @desc Create subCategory
// @route POST /api/v1/subCategories
// @access Private
exports.createSubCategory = createOne(SubCategoryModel)

// @desc Update specific subCategory by id
// @route PUT /api/v1/subCategories/:id
// @access Private
exports.updateSubCategory = updateOne(SubCategoryModel)

// @desc Delete specific subCategory by id
// @route DELETE /api/v1/subCategories/:id
// @access Private
exports.deleteSubCategory = deleteOne(SubCategoryModel)
