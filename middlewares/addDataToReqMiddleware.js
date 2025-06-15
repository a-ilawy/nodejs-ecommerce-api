const { default: slugify } = require("slugify");

exports.setCategoryIDToSubCategoryBodyReq = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createFilterObj = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };
  req.filterObj = filter;
  next();
};

exports.setSlugToProductBodyReq = (req, res, next) => {
  if (req.body.title) req.body.slug = slugify(req.params.title);
  next();
};
