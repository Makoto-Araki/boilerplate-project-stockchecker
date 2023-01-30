'use strict';

module.exports = function(app) {
  app.route('/api/stock-prices')
    // URL/api/stock-prices?stock=GOOG
    .get(function(req, res) {
      console.log(req.params);
    }
  );
};
