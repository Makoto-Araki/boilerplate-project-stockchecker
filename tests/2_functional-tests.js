const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mod1 = require('../modules/mod1');
const mod2 = require('../modules/mod2');

chai.use(chaiHttp);

// Function for Get Stock Price
const getStockPrice = async function(name) {
  let price = await mod1.getStockPrice(name);
  return price;
}

// Variables for Stock Price
let stock1 = 0;
let stock2 = 0;
let stock3 = 0;

// Get Stock Price of AAPL
getStockPrice('AAPL').then(function(result) {
  stock1 = result;
});

// Get Stock Price of NFLX
getStockPrice('NFLX').then(function(result) {
  stock2 = result;
});

// Get Stock Price of TSLA
getStockPrice('TSLA').then(function(result) {
  stock3 = result;
});

suite('Functional Tests', function() {
  this.timeout(5000);
  /* ------------------------------------------------------------ *
  test('Viewing one stock', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL' })
      .end(function(err, res) {
        assert.equal(res.body.stockData.stock, 'AAPL');
        assert.equal(res.body.stockData.price, stock1);
        assert.equal(res.body.stockData.likes, 0);
        done();
      });
  });
  /* ------------------------------------------------------------ *
  test('Viewing one stock and liking it', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL', like: 'true' })
      .end(function(err, res) {
        assert.equal(res.body.stockData.stock, 'AAPL');
        assert.equal(res.body.stockData.price, stock1);
        assert.equal(res.body.stockData.likes, 0);
        done();
      });
  });
  /* ------------------------------------------------------------ *
  test('Viewing the same stock and liking it again', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL', like: 'true' })
      .end(function(err, res) {
        assert.equal(res.body.stockData.stock, 'AAPL');
        assert.equal(res.body.stockData.price, stock1);
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });
  /* ------------------------------------------------------------ *
  test('Viewing two stocks', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: ['AAPL', 'NFLX'] })
      .end(function(err, res) {
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData[0].stock, 'AAPL');
        assert.equal(res.body.stockData[0].price, stock1);
        assert.equal(res.body.stockData[0].rel_likes, 1);
        assert.equal(res.body.stockData[1].stock, 'NFLX');
        assert.equal(res.body.stockData[1].price, stock2);
        assert.equal(res.body.stockData[1].rel_likes, -1);
        done();
      });
  });
  /* ------------------------------------------------------------ *
  test('Viewing two stocks and liking them', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: ['NFLX', 'TSLA'], like: 'true' })
      .end(function(err, res) {
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData[0].stock, 'NFLX');
        assert.equal(res.body.stockData[0].price, stock2);
        assert.equal(res.body.stockData[0].rel_likes, 0);
        assert.equal(res.body.stockData[1].stock, 'TSLA');
        assert.equal(res.body.stockData[1].price, stock3);
        assert.equal(res.body.stockData[1].rel_likes, 0);
        done();
      });
  });
  /* ------------------------------------------------------------ */
});
