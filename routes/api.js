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
const getStockLikes = function(name) {
  let opt1 = { like: name };
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
const getStockPrice = function(name) {
  return new Promise(function(resolve) {
    let option = {
      url: `${proxy}/${version}/stock/${name}/quote`,
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
  if (req.headers['x-forwarded-for']) {
    return req.headers['x-forwarded-for'];
  } else if (req.connection && req.connection.remoteAddress) {
    return req.connection.remoteAddress;
  } else if (req.connection.socket && req.connection.socket.remoteAddress) {
    return req.connection.socket.remoteAddress;
  } else if (req.socket && req.socket.remoteAddress) {
    return req.socket.remoteAddress;
  } else {
    return '0.0.0.0';
  }
}

// Main Processing
const mainProcess = async function(req) {
  let addr = getRemoteClientIpAddr(req);
  let result = {};
  let object = {};
  if (Array.isArray(req.query.stock) === false) {
    object.stock = req.query.stock;
    object.price = await getStockPrice(req.query.stock);
    object.likes = await getStockLikes(req.query.stock);
    result.stockData = object;
  }
  console.dir(result);
  return result;
  //let info1 = await getStockPriceFromAPI(req);
  //let info2 = await getStockLikesFromCol(req);
  //console.log(`AAA : ${info1}`);
  //console.log(`BBB : ${info2}`);
  //console.log(`CCC : ${info3}`);
}

// [API]?stock=GOOG
// { stock: 'GOOG' }

// [API]?stock=GOOG&stock=MSFT
// { stock: ['GOOG', 'MSFT'] }

// [API]?stock=GOOG&stock=MSFT&stock=TSLA
// { stock: ['GOOG', 'MSFT', 'TSLA'] }

// [API]?like=false
// { like: 'false' }

// [API]?like=false&like=true
// { like: ['false', 'true'] }

// [API]?like=false&like=true&like=false
// { like: ['false', 'true', 'false'] }

// Web - API
module.exports = function(app) {
  app.route('/api/stock-prices')
    .get(function(req, res) {
      //let result = mainProcess(req);
      console.dir(mainProcess(req));
      //res.send(result);
    }
  );
};
