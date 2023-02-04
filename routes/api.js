'use strict';

const request = require('request');

module.exports = function(app) {
  app.route('/api/stock-prices')
    //{ stock: 'GOOG', like: 'false' }
    //{ stock: 'GOOG', like: 'true' }
    //{ stock: [ 'GOOG', 'MSFT' ], like: 'false' }
    //{ stock: [ 'GOOG', 'MSFT' ], like: 'true' }
    .get(function(req, res) {
      let proxy = 'https://stock-price-checker-proxy.freecodecamp.rocks';
      let vers = 'v1';
      let name = req.query.stock;
      let like = req.query.like;
      let option = {
        url: `${proxy}/${vers}/stock/${name}/quote`,
        method: 'GET',
        json: true
      }
      let temp = {};
      let result = {};
      request(option, (error, response, body) => {
        if (!error) {
          temp.stock = req.query.stock;
          temp.price = body.latestPrice;
          result.stockData = temp;
          res.send(result);
        }
      });
    }
  );
};
