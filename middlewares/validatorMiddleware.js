const { validationResult } = require("express-validator");

const validatorMiddleware = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ erros: error.array() });
  }
  next();
};

module.exports = validatorMiddleware;
