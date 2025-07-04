// nested route (create)
exports.setCategoryIDToSubCategoryBodyReq = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// nested route (get)
exports.createFilterObj = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };
  req.filterObj = filter;
  next();
};
