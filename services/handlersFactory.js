
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const ProductModel = require("../models/productModel");

exports.deleteOne = (Model)=>asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await Model.findByIdAndDelete({ _id: id });
  if (!document) {
    // res.status(404).json({ msg: `No Brand for this id ${id}` });
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});


exports.updateOne = (Model)=> asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const documents = await Model.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!documents) {
    // res.status(404).json({ msg: `No Brand for this id ${id}` });
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ data: documents });
});


exports.createOne = (Model)=> asyncHandler(async (req, res) => {
  const document = await Model.create(req.body);
  res.status(201).json({ data: document });
});


exports.getOne = (Model)=> asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await Model.findById(id);
  if (!document) {
    // res.status(404).json({ msg: `No Brand for this id ${id}` });
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});


exports.getAll = (Model)=> asyncHandler(async (req, res) => {
  let s = '';
  if(Model === ProductModel){
    s = 'Products'
  }
  let filter = {};
  if(req.filterObj){
    filter = req.filterObj;
  }
  const documentsCounts = await Model.countDocuments();
  const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
    .paginate(documentsCounts)
    .filter()
    .search(s)
    .limitFields()
    .sort();
  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;

  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: documents });
});