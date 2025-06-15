const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const BrandModel = require("../models/brandModel");
const ApiError = require("../utils/apiError");

// @desc Get list of categories
// @route GET /api/v1/categories
// @access Public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const brands = await BrandModel.find({}).skip(skip).limit(limit);

  res.status(200).json({ results: brands.length, page, data: brands });
});

// @desc Get specific Brand by id
// @route GET /api/v1/categories/:id
// @access Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brands = await BrandModel.findById(id);
  if (!brands) {
    // res.status(404).json({ msg: `No Brand for this id ${id}` });
    return next(new ApiError(`No Brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brands });
});

// @desc Create Brand
// @route POST /api/v1/categories
// @access Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const Brand = await BrandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: Brand });
});

// @desc Update specific Brand by id
// @route PUT /api/v1/categories/:id
// @access Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brands = await BrandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brands) {
    // res.status(404).json({ msg: `No Brand for this id ${id}` });
    return next(new ApiError(`No Brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brands });
});

// @desc Delete specific Brand by id
// @route DELETE /api/v1/categories/:id
// @access Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brands = await BrandModel.findByIdAndDelete({ _id: id });
  if (!brands) {
    // res.status(404).json({ msg: `No Brand for this id ${id}` });
    return next(new ApiError(`No Brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brands });
});
