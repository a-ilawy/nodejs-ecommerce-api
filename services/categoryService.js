const CategoryModel = require("../models/categoryModel");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlersFactory");
// @desc Get list of categories
// @route GET /api/v1/categories
// @access Public
exports.getCategories = getAll(CategoryModel)

// @desc Get specific category by id
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = getOne(CategoryModel)

// @desc Create category
// @route POST /api/v1/categories
// @access Private
exports.createCategory = createOne(CategoryModel)

// @desc Update specific category by id
// @route PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = updateOne(CategoryModel)

// @desc Delete specific category by id
// @route DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = deleteOne(CategoryModel)