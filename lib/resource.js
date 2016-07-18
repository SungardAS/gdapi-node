var _ = require("lodash");

var Resource = function(options) {
  var opts = _.merge({},this,options);
  _.assign(this,opts);
};

Resource.prototype.getAttribute = function(name) {
  return this.attributes[name];
};

Resource.prototype.followLink = function(linkName) {
  var self = this;
  var p = Promise.resolve(linkName);
  return p.then(function(linkName) {
    var links = self.getAttribute("links")
    if (links && links[linkName]) {
      return self.client.fetchUrl(links[linkName],{json: true})
    }
    else {
      throw "Link not found";
    }
  });
};


module.exports = Resource;
