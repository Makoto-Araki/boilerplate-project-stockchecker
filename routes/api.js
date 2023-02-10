'use strict';

// Import Module
const mongoose = require('mongoose');
const request = require('request');
const dotenv = require('dotenv');
const mod1 = require('../modules/mod1');
const mod2 = require('../modules/mod2');

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
  let addr = getClientAddr(req);
  let name1 = '';
  let name2 = '';
  let flg1 = false;
  let flg2 = false;
  let price1 = 0;
  let price2 = 0;
  let likes1 = 0;
  let likes2 = 0;
  if (Array.isArray(req.query.stock) === false) {
    name1 = req.query.stock;
    flg1 = await mod2.chkAddrStockPairs(addr, name1);
    let result1 = {
      stockData: {
        stock: req.query.stock,
        price: await mod1.getStockPrice(req.query.stock),
        likes: await mod2.getStockLikes(req.query.stock)
      }
    }
    if (req.query.like === 'true' && flg1 === false) {
      await mod2.setStockLikes(addr, req.query.stock);
    }
    return result1;
  } else {
    name1 = req.query.stock[0];
    name2 = req.query.stock[1];
    flg1 = await mod2.chkAddrStockPairs(addr, name1);
    flg2 = await mod2.chkAddrStockPairs(addr, name2);
    price1 = await mod1.getStockPrice(name1);
    price2 = await mod1.getStockPrice(name2);
    likes1 = await mod2.getStockLikes(name1);
    likes2 = await mod2.getStockLikes(name2);
    let result2 = {
      stockData: [
        { stock: name1, price: price1, rel_likes: likes1 - likes2 },
        { stock: name2, price: price2, rel_likes: likes2 - likes1 }
      ]
    };
    if (req.query.like === 'true' && flg1 === false) {
      await mod2.setStockLikes(addr, name1);
    }
    if (req.query.like === 'true' && flg2 === false) {
      await mod2.setStockLikes(addr, name2);
    }
    return result2;
  }
}

// Web - API
module.exports = function(app) {
  app.route('/api/stock-prices')
    .get(function(req, res) {
      mainProcess(req)
        .then(function(result) {
          //console.log(result);
          res.send(result);
        });
    }
  );
};
