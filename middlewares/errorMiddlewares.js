const ApiError = require("../exeptions/apiError");

module.exports = function (err, req, res, next) {
  if (err instanceof ApiError) {
    console.log(err, "Api Err2");
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: "Непредвиденная ошибка" });
};
