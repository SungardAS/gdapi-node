var _ = require("lodash");

var Schema = function(options) {
  var opts = _.merge({},this,options);
  _.assign(this,opts);

};


module.exports = Schema;
