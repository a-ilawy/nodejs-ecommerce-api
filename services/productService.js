/* eslint-disable node/no-unsupported-features/es-syntax */
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const ApiError = require("../utils/apiError");
const ProductModel = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");

// @desc Get list of products
// @route GET /api/v1/products
// @access Public
exports.getProducts = asyncHandler(async (req, res) => {
  const documentsCounts = await ProductModel.countDocuments();
  const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
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


// @desc Get specific product by id
// @route GET /api/v1/products/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const products = await productModel.findById(id);
  if (!products) {
    // res.status(404).json({ msg: `No product for this id ${id}` });
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: products });
});

// @desc Create product
// @route POST /api/v1/products
// @access Private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);

  const product = await productModel.create(req.body);
  res.status(201).json({ data: product });
});

// @desc Update specific product by id
// @route PUT /api/v1/products/:id
// @access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const products = await productModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!products) {
    // res.status(404).json({ msg: `No product for this id ${id}` });
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: products });
});

// @desc Delete specific product by id
// @route DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const products = await productModel.findByIdAndDelete({ _id: id });
  if (!products) {
    // res.status(404).json({ msg: `No product for this id ${id}` });
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: products });
});
