const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const BrandModel = require("../models/brandModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// @desc Get list of Brands
// @route GET /api/v1/Brands
// @access Public
exports.getBrands = asyncHandler(async (req, res) => {
 const documentsCounts = await BrandModel.countDocuments();
  const apiFeatures = new ApiFeatures(BrandModel.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();
  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;

  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: documents });
});

// @desc Get specific Brand by id
// @route GET /api/v1/Brands/:id
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
// @route POST /api/v1/Brands
// @access Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const Brand = await BrandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: Brand });
});

// @desc Update specific Brand by id
// @route PUT /api/v1/Brands/:id
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
// @route DELETE /api/v1/Brands/:id
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
