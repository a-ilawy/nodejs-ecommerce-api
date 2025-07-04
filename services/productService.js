/* eslint-disable node/no-unsupported-features/es-syntax */
const ProductModel = require("../models/productModel");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlersFactory");

// @desc Get list of products
// @route GET /api/v1/products
// @access Public
exports.getProducts = getAll(ProductModel)

// @desc Get specific product by id
// @route GET /api/v1/products/:id
// @access Public
exports.getProduct = getOne(ProductModel)

// @desc Create product
// @route POST /api/v1/products
// @access Private
exports.createProduct = createOne(ProductModel)

// @desc Update specific product by id
// @route PUT /api/v1/products/:id
// @access Private
exports.updateProduct = updateOne(ProductModel)

// @desc Delete specific product by id
// @route DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = deleteOne(ProductModel)
