const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mod1 = require('../modules/mod1');
const mod2 = require('../modules/mod2');

chai.use(chaiHttp);

// Main Process
const mainProcess = async function(name) {
  let price = await mod1.getStockPrice(name);
  let likes = await mod2.getStockLikes(name);
  return { price: price, likes: likes };
}

suite('Functional Tests', function() {
  /* ------------------------------------------------------------ *
  test('Viewing one stock', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL' })
      .end(function(err, res) {
        mainProcess('AAPL')
          .then(function(result) {
            assert.equal(res.body.stockData.stock, 'AAPL');
            assert.equal(res.body.stockData.price, result.price);
            assert.equal(res.body.stockData.likes, result.likes);
          });
        done();
      });
  });
  /* ------------------------------------------------------------ *
  //
  /* ------------------------------------------------------------ */
});
