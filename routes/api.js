'use strict';

const request = require('request');

module.exports = function(app) {
  app.route('/api/stock-prices')
    // URL/api/stock-prices?stock=GOOG
    //{ stock: 'GOOG', like: 'false' }
    //{ stock: 'GOOG', like: 'true' }
    //{ stock: [ 'GOOG', 'MSFT' ], like: 'false' }
    //{ stock: [ 'GOOG', 'MSFT' ], like: 'true' }
    .get(function(req, res) {
      let symbol = req.query.stock;
      let target = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;
      request(target, (err, res, body) => {
        console.log(JSON.parse(res.body));
      });
    }
  );
};
