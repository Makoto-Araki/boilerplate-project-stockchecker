// Import Module
const request = require('request');

// Constant for Proxy API
const proxy = 'https://stock-price-checker-proxy.freecodecamp.rocks';
const version = 'v1';

// Get Stock Price from Proxy API
const getStockPrice = function(name) {
  return new Promise(function(resolve, reject) {
    let option = {
      url: `${proxy}/${version}/stock/${name}/quote`,
      method: 'GET',
      json: true
    }
    request(option, (err, res, body) => {
      if (!err) {
        resolve(body.latestPrice);
      } else {
        reject(err);
      }
    });
  });
}

// Exports
exports.getStockPrice = getStockPrice;