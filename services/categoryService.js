const slugify = require('slugify');
const asyncHandler = require('express-async-handler')
const CategoryModel = require('../models/categoryModel');
const ApiError = require('../utils/apiError');

// @desc Get list of categories
// @route GET /api/v1/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    const categories = await CategoryModel.find({}).skip(skip).limit(limit);

    res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc Get specific category by id
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const categories = await CategoryModel.findById(id);
    if (!categories) {
        // res.status(404).json({ msg: `No category for this id ${id}` });
        return next(new ApiError(`No category for this id ${id}`, 404));
    }
    res.status(200).json({ data: categories });

});

// @desc Create category
// @route POST /api/v1/categories
// @access Private
exports.createCategory = asyncHandler(async (req, res) => {
    const name = req.body.name;

    const category = await CategoryModel.create({ name, slug: slugify(name) });
    res.status(201).json({ data: category });

});

// @desc Update specific category by id
// @route PUT /api/v1/categories/:id
// @access Public
exports.updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const name = req.body.name;

    const categories = await CategoryModel.findOneAndUpdate({ _id: id }, { name, slug: slugify(name) }, { new: true });
    if (!categories) {
        // res.status(404).json({ msg: `No category for this id ${id}` });
        return next(new ApiError(`No category for this id ${id}`, 404));
    }
    res.status(200).json({ data: categories });

});

// @desc Delete specific category by id
// @route DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const categories = await CategoryModel.findByIdAndDelete({ _id: id });
    if (!categories) {
        // res.status(404).json({ msg: `No category for this id ${id}` });
        return next(new ApiError(`No category for this id ${id}`, 404));
    }
    res.status(200).json({ data: categories });

});