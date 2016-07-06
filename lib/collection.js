var _ = require("lodash");
var request = require("request-promise");
var Resource = require("./resource");

var Collection = function(options) {
  var opts = _.merge({},this,options);
  _.assign(this,opts);

};

Collection.prototype.create = function(obj) {
  var self = this;
  if(_.includes(this.schema.attributes.collectionMethods,"POST")) {
    return request({
      uri: self.schema.attributes.links.collection,
      method: "POST",
      body: obj,
      // resolveWithFullResponse: true,
      json: true
    }).then(function(resourceObj) {
      return new Resource({attributes: resourceObj, client: self.client});
    });
  }
  else {
    throw "Create not allowed";
  }
};

Collection.prototype.createAction = function(action,obj) {
  var self = this;
  var p = Promise.resolve(action);
  return p.then(function(action) {
    return self.client.collection(action);
  })
  .then(function(collection) {
    return collection.create(obj);
  });
};



Collection.prototype.get = function(id) {
  if(_.includes(this.schema.attributes.collectionMethods,"GET")) {
    return request({
      uri: [self.schema.attributes.links.collection,id].join("/"),
      method: "GET",
      json: true
    });
  }
  else {
    throw "Get not allowed";
  }
};


module.exports = Collection;
