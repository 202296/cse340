const errorController = {};

errorController.triggerError = function (req, res, next) {
  throw new Error("Intentional error");
};

module.exports = errorController;
