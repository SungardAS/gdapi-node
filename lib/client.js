var Collection = require("./collection");
var Promise = require("bluebird");
var Resource = require("./resource");
var Schema = require("./schema");
var _ = require("lodash");
var request = require("requestretry");

var Client = function(options) {
  var opts = _.merge({},this,options);
  this.baseUrl = opts.baseUrl;
  this.requestDefaults = {
    promiseFactory: function(resolver) {
      return new Promise(resolver);
    },
    maxAttempts: opts.maxAttempts || 5,
    retryDelay: opts.retryDelay || 5000
  };

  if (opts.auth)
    this.requestDefaults.auth = auth;

  this.request = request.defaults(this.requestDefaults);

};

Client.prototype.collection = function(collectionName) {
  var self = this;
  return this._fetchSchema(collectionName).then(function(schema) {
    var collection = new Collection({schema: schema, client: self});
    return collection;
  });
};

Client.prototype.setAuth = function(auth) {
  auth.sendImmediately = false;
  this.requestDefaults.auth = auth;
  this.request = request.defaults(this.requestDefaults);
};

Client.prototype._fetchSchemaUrl = function() {
  var baseUrl = this.baseUrl;
  var self = this;

  var requestOpts = {
    url: baseUrl,
    fullResponse: true
  };

  return this.request(requestOpts).then(function(response) {
    var schemaUrl = response.headers['x-api-schemas'];
    return schemaUrl;
  });
};

Client.prototype._fetchSchema = function(schemaName) {
  var self = this;

  return this._fetchSchemaUrl().then(function(schemaUrl) {
    var requestOpts = {
      url: [schemaUrl,schemaName].join('/'),
      fullResponse: false,
      json: true
    };
    return self.request(requestOpts)
  })
  .then(function(schemaJson) {
    return new Schema({attributes: schemaJson, client: self});
  });
};

Client.prototype._fetchAllSchemas = function() {
  var self = this;

  return this._fetchSchemaUrl().then(function(schemaUrl) {
    var requestOpts = {
      url: schemaUrl,
      fullResponse: false,
      json: true
    };
    return self.request(requestOpts);
  });
};

Client.prototype.fetchUrl = function(url,options) {
  var opts = _.merge({
    url: url,
    fullResponse: false,
    json: true
  },options);

  var self = this;
  var p;

  return self.request(opts)
  .then(function(obj) {
    this._origObj = obj;
    if (obj.resourceType) {
      return self._fetchSchema(obj.resourceType)
    }
    else {
      return self._fetchSchema(obj.type);
    }
  })
  .then(function(schema) {
    if (this._origObj.type === "collection") {
      return new Collection({attributes: this._origObj, schema: schema, client: self});
    }
    else {
      return new Resource({attributes: this._origObj, schema: schema, client: self});
    }
  });
};

module.exports = Client;
