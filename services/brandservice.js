const BrandModel = require("../models/brandModel");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlersFactory");

// @desc Get list of Brands
// @route GET /api/v1/Brands
// @access Public
exports.getBrands = getAll(BrandModel)

// @desc Get specific Brand by id
// @route GET /api/v1/Brands/:id
// @access Public
exports.getBrand = getOne(BrandModel)

// @desc Create Brand
// @route POST /api/v1/Brands
// @access Private
exports.createBrand = createOne(BrandModel)

// @desc Update specific Brand by id
// @route PUT /api/v1/Brands/:id
// @access Private
exports.updateBrand = updateOne(BrandModel)

// @desc Delete specific Brand by id
// @route DELETE /api/v1/Brands/:id
// @access Private
exports.deleteBrand = deleteOne(BrandModel);
