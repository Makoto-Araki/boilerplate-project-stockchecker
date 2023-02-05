'use strict';

// Import Module
const request = require('request');
const mongodb = require('mongodb');

// Secrets
const user = process.env['user']
const pass = process.env['pass']

// Constant for Proxy API
const proxy = 'https://stock-price-checker-proxy.freecodecamp.rocks';
const version = 'v1';

// Constant for Mongo Collection
const client = mongodb.MongoClient;
const mongouri = `mongodb+srv://${user}:${pass}@cluster0.snt16.mongodb.net/test?retryWrites=true&w=majority`;

// Get Stock Price from Proxy API
const getStockPriceFromAPI = function(name) {
  return new Promise(function(resolve) {
    let option = {
      url: `${proxy}/${version}/stock/${name}/quote`,
      method: 'GET',
      json: true
    }
    console.log('B01');
    request(option, (error, response, body) => {
      if (!error) {
        resolve(body.latestPrice);
      }
    });
    console.log('B02');
  });
}

// Get Stock likes from Mongo Collection
const getStockLikesFromCol = function(name) {
  return new Promise(function(resolve) {
    client.connect(mongouri, { useNewUrlParser: true }, function(err, con) {
      console.log('C01');
      let collection = con.db('test').collection('likes');
      collection.find().toArray(function(errs, cols) {
        if (!errs) {
          resolve(cols);
        } else {
          reject(errs);
        }
      });
      console.log('C02');
      con.close();
    });
  });
}

// Main Processing
async function mainProcess(name) {
  let result1 = await getStockPriceFromAPI(name);
  let result2 = await getStockLikesFromCol(name);
  console.log(result1);
  console.log(result2);
}
//{ stock: 'GOOG', like: 'false' }
//{ stock: 'GOOG', like: 'true' }
//{ stock: [ 'GOOG', 'MSFT' ], like: 'false' }
//{ stock: [ 'GOOG', 'MSFT' ], like: 'true' }

// Main Process
module.exports = function(app) {
  app.route('/api/stock-prices')
    .get(function(req, res) {
      mainProcess(req.query.stock);
    }
  );
};
