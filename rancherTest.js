var Client = require("./lib/client");

var client = new Client({baseUrl: "https://r001p001.charreada.sungardas.io/"});

client.collection("account").then(function(col) {
  var create = col.create({
    "kind": "service",
    "name": "CharreadaService50",
    "uuid": "CharreadaService50",
  });

  create.then(function(account) {
    this.account = account;
    return account.followLink("credentials")
  })
  .then(function(credsCollection) {
    return credsCollection.createAction('apiKey',{
      accountId: this.account.getAttribute("id")
    });
  })
  .then(console.log);

});;
