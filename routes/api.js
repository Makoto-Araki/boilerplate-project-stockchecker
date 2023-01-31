'use strict';

const request = require('request');

module.exports = function(app) {
  app.route('/api/stock-prices')
    //{ stock: 'GOOG', like: 'false' }
    //{ stock: 'GOOG', like: 'true' }
    //{ stock: [ 'GOOG', 'MSFT' ], like: 'false' }
    //{ stock: [ 'GOOG', 'MSFT' ], like: 'true' }
    .get(function(req, res) {
      let symbol = req.query.stock;
      let target = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;
      request(target, (err, res, body) => {
        // Step1
        //console.log(res.body['latestPrice']);
        //console.log(res.body.hasOwnProperty('symbol'));
        //console.log(res.body.hasOwnProperty('latestPrice'));
        //console.dir(res.body);
        console.log(res.body['avgTotalVolume']);
        //let price = res.body.latestPrice;
        // Step2
        //let object = {};
        //object.stock = symbol;
        //object.price = price;
        // Step3
        //let result = {};
        //result.stockdata = object;
        //console.log(result);
        // Step4
        //return JSON.parse(result);
      });
    }
  );
};
