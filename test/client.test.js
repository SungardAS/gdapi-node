var Client = require("../lib/client");

describe("Client", function() {
  describe("_fetchAllSchemas", function() {
    this.timeout(10000);

    it("fetches all of the schemas", function() {
      var client = new Client({
        baseUrl: "https://r001p001.charreada.sungardas.io/"
      });

      return client._fetchAllSchemas();
    });

  });

  describe("_fetchSchema", function() {

    it("fetches a single schema", function() {
      var client = new Client({
        baseUrl: "https://r001p001.charreada.sungardas.io/"
      });

      return client._fetchSchema("schema");
    });
  });

  describe("collection", function() {

    it("creates an object", function() {
      var client = new Client({
        baseUrl: "https://r001p001.charreada.sungardas.io/"
      });

      return client.collection("schema").then(console.log);
    });
  });
});
