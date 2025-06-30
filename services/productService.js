/* eslint-disable node/no-unsupported-features/es-syntax */
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const ApiError = require("../utils/apiError");

// @desc Get list of products
// @route GET /api/v1/products
// @access Public
exports.getProducts = asyncHandler(async (req, res) => {
  // Clone and clean the query
  const queryStringObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((field) => delete queryStringObj[field]);

  // Optional custom operator overrides
  const operatorsOverride = {
    'price[gte]': 'lte', // Example: price[gte]=50 → price: {lte: 50}
  };

  // Convert query like price[gte]=50 → { price: "{lte:50}" }
  const output = Object.entries(queryStringObj).reduce((acc, [key, value]) => {
    const match = key.match(/^(.+)\[(.+)\]$/);
    if (match) {
      const field = match[1];
      const operator = operatorsOverride[key] || match[2];
      acc[field] = `{${operator}:${value}}`;
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});

  console.log('Formatted Output:', output);
  // Example: { ratingAverage: '{gte:2}', price: '{lte:50}' }

  // Convert to actual MongoDB filters
  const mongoFilter = Object.entries(output).reduce((acc, [key, val]) => {
    const parsed = val.match(/^\{(.+):(.+)\}$/);
    if (parsed) {
      acc[key] = { [`$${parsed[1]}`]: parsed[2] };
    } else {
      acc[key] = val;
    }
    return acc;
  }, {});
  console.log('mongoFilter Output:', mongoFilter);
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const skip = (page - 1) * limit;

  // Query MongoDB
  const products = await productModel
    .find(mongoFilter)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    results: products.length,
    page,
    data: products,
  });
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
