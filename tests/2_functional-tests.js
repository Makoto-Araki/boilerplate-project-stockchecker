const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

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

// Main Process
const mainProcess = async function(name) {
  let price = await getStockPrice(name);
  return price;
}

suite('Functional Tests', function() {
  test('Viewing one stock', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL' })
      .end(function(err, res) {
        mainProcess('AAPL')
          .then(function(price) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.stockData.stock, 'AAPL');
            assert.equal(res.stockData.price, price);
            assert.equal(res.stockData.likes, 0);
          });
        done();
      });
  });
});
