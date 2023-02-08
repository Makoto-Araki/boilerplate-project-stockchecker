const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const api = require('../routes/api');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Viewing one stock', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL' })
      .end(function(err, res) {
        
        //let price = api.getStockPrice('AAPL');
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        //assert.equal(res.stockData.stock, 'AAPL');
        //assert.equal(res.stockData.price, price);
        done();
      });
  });
});
