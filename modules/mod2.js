// Import Module
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    entry.addr = bcrypt.hashSync(addr, 12);  // saltRounds(12)
    entry.like = name;
    entry.save(function(err, doc) {
      if (!err) {
        resolve(doc);
      } else {
        reject(err);
      }
    });
  });
}

// Check if a combination of IP address and stock name exists
const chkAddrStockPairs = function(addr, name) {
  let flg = false;
  let opt1 = { like: name };
  let opt2 = { _id: 0, __v: 0 };
  return new Promise(function(resolve, reject) {
    Likes
      .find(opt1)
      .select(opt2)
      .exec(function(err, doc) {
        if (!err) {
          for (let i = 0; i < doc.length; i++) {
            if (bcrypt.compareSync(addr, doc[i].addr) === true) {
              flg = true;
              break;
            }
          }
          resolve(flg);
        } else {
          reject(err);
        }
      });
  });
}

// Exports
exports.getStockLikes = getStockLikes;
exports.setStockLikes = setStockLikes;
exports.chkAddrStockPairs = chkAddrStockPairs;