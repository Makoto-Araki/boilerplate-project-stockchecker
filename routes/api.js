'use strict';

// Import Module
const request = require('request');
const mongodb = require('mongodb');

// Constant for Proxy API
const proxy = 'https://stock-price-checker-proxy.freecodecamp.rocks';
const version = 'v1';

// Constant for Mongo Collection
const client = mongodb.MongoClient;

// Get Stock Price from Proxy API
const getStockPriceFromAPI = function(name) {
  return new Promise(function(resolve) {
    let option = {
      url: `${proxy}/${version}/stock/${name}/quote`,
      method: 'GET',
      json: true
    }
    request(option, (error, response, body) => {
      if (!error) {
        resolve(body.latestPrice);
      }
    });
  });
}

// Get Stock likes from Mongo Collection
const getStockLikesFromCollection = function() {}

//{ stock: 'GOOG', like: 'false' }
//{ stock: 'GOOG', like: 'true' }
//{ stock: [ 'GOOG', 'MSFT' ], like: 'false' }
//{ stock: [ 'GOOG', 'MSFT' ], like: 'true' }

// Main Process
module.exports = function(app) {
  app.route('/api/stock-prices')
    .get(function(req, res) {
      let result1;
      let result2;
      result1 = getStockPriceFromAPI(req.query.stock);
      result1
        .then(function(data) {
          console.log(data);
        });
    }
  );
};
