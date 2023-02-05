'use strict';

// Import Module
const mongoose = require('mongoose');
const request = require('request');
const dotenv = require('dotenv');

// Secrets Config
dotenv.config();

// Secrets
const user = process.env['user'];
const pass = process.env['pass'];
const cluster = process.env['cluster'];
const option = process.env['option'];
const database = process.env['database'];

// Constant for Mongo Database
const mongouri = `mongodb+srv://${user}:${pass}@${cluster}/${database}?${option}`;

// Constant for Proxy API
const proxy = 'https://stock-price-checker-proxy.freecodecamp.rocks';
const version = 'v1';

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
  //return new Promise(function(resolve) {
    client.connect(mongouri, { useNewUrlParser: true }, function(err, con) {
      if (!err) {
        console.log(err);
      } else {
        let collection = con.db('test').collection('likes');
        collection.find().toArray(function(errs, cols) {
          if (!errs) {
            console.log(cols);
          } else {
            console.log(errs);
          }
        });
      }
      con.close();
    });
  //});
}

// Main Processing
async function mainProcess(name) {
  let result1 = await getStockPriceFromAPI(name);
  //let result2 = await getStockLikesFromCol(name);
  console.log(result1);
  getStockLikesFromCol(name);
  //console.log(result2);
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
