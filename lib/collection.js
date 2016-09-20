var _ = require("lodash");
var Resource = require("./resource");

var Collection = function(options) {
  var opts = _.merge({},this,options);
  _.assign(this,opts);

};

Collection.prototype.create = function(obj) {
  var self = this;
  if(_.includes(this.schema.attributes.collectionMethods,"POST")) {
    return self.client.request({
      url: self.schema.attributes.links.collection,
      method: "POST",
      fullResponse: false,
      body: obj,
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
  var self = this;
  if(_.includes(this.schema.attributes.collectionMethods,"GET")) {
    return self.client.request({
      url: [self.schema.attributes.links.collection,id].join("/"),
      method: "GET",
      fullResponse: false,
      json: true
    });
  }
  else {
    throw "Get not allowed";
  }
};

Collection.prototype.getAll = function(id) {
  var self = this;
  if(_.includes(this.schema.attributes.collectionMethods,"GET")) {
    return self.client.request({
      url: self.schema.attributes.links.collection,
      method: "GET",
      fullResponse: false,
      json: true
    });
  }
  else {
    throw "Get not allowed";
  }
};

Collection.prototype.filter = function(qs) {
  var self = this;
  if(_.includes(this.schema.attributes.collectionMethods,"GET")) {
    return self.client.request({
      url: self.schema.attributes.links.collection,
      qs: qs,
      method: "GET",
      fullResponse: false,
      json: true
    });
  }
  else {
    throw "Get not allowed";
  }
};


module.exports = Collection;
