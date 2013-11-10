config = require('./config');

module.exports = function () {
  return function (req, res, next) {
    var model = req.getModel();
    model.set('$config.version', config.get('version'));
    model.set('$config.repository', config.get('repository'));
    next();
  };
};