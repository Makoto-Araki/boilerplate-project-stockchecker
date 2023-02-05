'use strict';

// Import Module
const mongoose = require('mongoose');
const request = require('request');
const dotenv = require('dotenv');

// Secrets Config
dotenv.config();

// Secrets
const user = process.env['user'];
const pass = process.env['pass'];
const cluster = process.env['cluster'];
const database = process.env['database'];
const option = process.env['option'];

// Constant for Mongo Database
const mongouri = `mongodb+srv://${user}:${pass}@${cluster}/${database}?${option}`;

// MongoDB Connect Config
mongoose.set('strictQuery', false);

// MongoDB Connect
mongoose
  .connect(mongouri)
  .then(function() {
    console.log('MongoDB connected');
  })
  .catch(function(error) {
    console.log(error);
  });

// Schema
const likeSchema = new mongoose.Schema({
  addr: { type: String },
  like: { type: String }
});

// Model is made from schema
const Likes = mongoose.model('Likes', likeSchema);

// Get Stock likes from MongoDB Collection
const getStockLikesFromCol = function(name) {
  const opt1 = { like: name };
  const opt2 = { _id: 0, __v: 0 };
  return new Promise(function(resolve) {
    Likes
      .find(opt1)
      .select(opt2)
      .exec(function(err, doc) {
        if (!err) {
          resolve(doc);
        }
      });
  });
}

// Constant for Proxy API
const proxy = 'https://stock-price-checker-proxy.freecodecamp.rocks';
const version = 'v1';

// Get Stock Price from Proxy API
const getStockPriceFromAPI = function(name) {
  return new Promise(function(resolve) {
    let option = {
      url: `${proxy}/${version}/stock/${name}/quote`,
      method: 'GET',
      json: true
    }
    request(option, (error, response, body) => {
      if (!error) {
        resolve(body.latestPrice);
      }
    });
  });
}

// Main Processing
async function mainProcess(name) {
  let result1 = await getStockPriceFromAPI(name);
  let result2 = await getStockLikesFromCol(name);
  console.log(`AAA : ${result1}`);
  console.log(`BBB : ${result2}`);
}

//{ stock: 'GOOG', like: 'false' }
//{ stock: 'GOOG', like: 'true' }
//{ stock: [ 'GOOG', 'MSFT' ], like: 'false' }
//{ stock: [ 'GOOG', 'MSFT' ], like: 'true' }

// Main Process
module.exports = function(app) {
  app.route('/api/stock-prices')
    .get(function(req, res) {
      mainProcess(req.query.stock);
    }
  );
};
