'use strict';

const request = require('request');

module.exports = function(app) {
  app.route('/api/stock-prices')
    //{ stock: 'GOOG', like: 'false' }
    //{ stock: 'GOOG', like: 'true' }
    //{ stock: [ 'GOOG', 'MSFT' ], like: 'false' }
    //{ stock: [ 'GOOG', 'MSFT' ], like: 'true' }
    .get(function(req, res) {
      let option = {
        url: `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock}/quote`,
        method: 'GET',
        json: true
      }
      let tmp = {};
      let result = {};
      request(option, (error, response, body) => {
        if (!error) {
          tmp.stock = req.query.stock;
          tmp.price = body.latestPrice;
          console.log(tmp);
          result.stockData = tmp;
          console.log(result);
        }
      });
      res.json(result);
    }
  );
};
