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
const getStockLikesFromCol = function(req) {
  let opt1 = { like: req.query.stock };
  let opt2 = { _id: 0, __v: 0 };
  return new Promise(function(resolve) {
    Likes
      .find(opt1)
      .select(opt2)
      .exec(function(err, doc) {
        if (!err) {
          resolve(doc.length);
        }
      });
  });
}

// Check if a combination of IP address and likes exists
const chkAddrAndLike = function(addr, like) {
  //
}

// Constant for Proxy API
const proxy = 'https://stock-price-checker-proxy.freecodecamp.rocks';
const version = 'v1';

// Get Stock Price from Proxy API
const getStockPriceFromAPI = function(req) {
  return new Promise(function(resolve) {
    let option = {
      url: `${proxy}/${version}/stock/${req.query.stock}/quote`,
      method: 'GET',
      json: true
    }
    request(option, (err, res, body) => {
      if (!err) {
        resolve(body.latestPrice);
      }
    });
  });
}

// Get remote client IP address
const getRemoteClientIpAddr = function(req) {
  return new Promise(function(resolve) {
    if (req.connection && req.connection.remoteAddress) {
      resolve(req.connection.remoteAddress);
    }
  });
}

// Main Processing
async function mainProcess(req) {
  let info1 = await getStockPriceFromAPI(req);
  let info2 = await getStockLikesFromCol(req);
  let info3 = await getRemoteClientIpAddr(req);
  console.log(`AAA : ${info1}`);
  console.log(`BBB : ${info2}`);
  console.log(`CCC : ${info3}`);
}

//{ stock: 'GOOG', like: 'false' }
//{ stock: 'GOOG', like: 'true' }
//{ stock: [ 'GOOG', 'MSFT' ], like: 'false' }
//{ stock: [ 'GOOG', 'MSFT' ], like: 'true' }

// Web - API
module.exports = function(app) {
  app.route('/api/stock-prices')
    .get(function(req, res) {
      mainProcess(req);
    }
  );
};
