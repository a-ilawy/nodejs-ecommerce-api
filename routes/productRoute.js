const express = require("express");

const {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} = require("../services/productService");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidators");
const {
  setSlugToProductBodyReq,
} = require("../middlewares/addDataToReqMiddleware");

const router = express.Router();

router.route("/").get(getProducts).post(createProductValidator, createProduct);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
