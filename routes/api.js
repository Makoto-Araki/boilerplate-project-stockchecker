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
  return new Promise(function(resolve, reject) {
    Likes
      .find(opt1)
      .select(opt2)
      .exec(function(err, doc) {
        if (!err) {
          resolve(doc.length);
        } else {
          reject(err);
        }
      });
  });
}

// Set a combination of IP address and stock name in MongoDB collection
const setStockLikes = function(addr, name) {
  return new Promise(function(resolve, reject) {
    let entry = new Likes();
    entry.addr = addr;
    entry.like = name;
    entry.save(function(err, doc) {
      if (!err) {
        resolve(`addr : ${doc.addr} like : ${doc.like}`);
      } else {
        reject(err);
      }
    });
  });
}

// Check if a combination of IP address and stock name exists
const chkAddrStockPairs = function(addr, name) {
  let opt1 = { addr: addr, like: name };
  let opt2 = { _id: 0, __v: 0 };
  return new Promise(function(resolve, reject) {
    Likes
      .find(opt1)
      .select(opt2)
      .exec(function(err, doc) {
        if (!err) {
          resolve(doc.length);
        } else {
          reject(err);
        }
      });
  });
}

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

// Get remote client IP address
const getClientAddr = function(req) {
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

// Main Process
const mainProcess = async function(req) {
  if (Array.isArray(req.query.stock) === false) {
    let addr = getClientAddr(req);
    let name = req.query.stock;
    let pair = await chkAddrStockPairs(addr, name);
    let result = {
      stockData: {
        stock: req.query.stock,
        price: await getStockPrice(req.query.stock),
        likes: await getStockLikes(req.query.stock)
      }
    }
    if (req.query.like === 'true' && pair === 0) {
      await setStockLikes(addr, req.query.stock);
    }
    return result;
  }
}

// Web - API
module.exports = function(app) {
  app.route('/api/stock-prices')
    .get(function(req, res) {
      mainProcess(req)
        .then(function(result) {
          console.log(result);
          res.send(result);
        });
    }
  );
};
