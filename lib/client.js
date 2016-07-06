var Collection = require("./collection");
var Promise = require("bluebird");
var Resource = require("./resource");
var Schema = require("./schema");
var _ = require("lodash");
var request = require("request-promise");

var Client = function(options) {
  var opts = _.merge({},this,options);
  this.baseUrl = opts.baseUrl;
};

Client.prototype.collection = function(collectionName) {
  var self = this;
  return this._fetchSchema(collectionName).then(function(schema) {
    var collection = new Collection({schema: schema, client: self});
    return collection;
  });
};

Client.prototype._fetchSchemaUrl = function() {
  var baseUrl = this.baseUrl;
  var self = this;

  return request(baseUrl,{resolveWithFullResponse:true}).then(function(response) {
    var schemaUrl = response.headers['x-api-schemas'];
    return schemaUrl;
  });
};

Client.prototype._fetchSchema = function(schemaName) {
  var self = this;
  return this._fetchSchemaUrl().then(function(schemaUrl) {
    return request([schemaUrl,schemaName].join('/'),{json:true})
  })
  .then(function(schemaJson) {
    return new Schema({attributes: schemaJson, client: self});
  });
};

Client.prototype._fetchAllSchemas = function() {
  return this._fetchSchemaUrl().then(function(schemaUrl) {
    return request(schemaUrl,{json:true});
  });
};

Client.prototype.fetchUrl = function(url,options) {
  var opts = _.merge({
    json: true
  },options);

  var self = this;
  var p;

  return request(url,opts)
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
