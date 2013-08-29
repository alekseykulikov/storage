
/**
 * Module dependencies
 */

var LZString  = require('./vendor/lz-string');
var store     = require('store');

/**
 * Expose `storage`
 */

module.exports = storage;

/**
 * Local variables
 */

var storage = {};
var keys    = store.get('.storage-keys') || [];
var current = keys[keys.length - 1];
var LIMIT   = 1024*20; // 20kb

/**
 * Put
 */

storage.put = function(key, val, cb) {
  key = prepareKey(key);
  if (!current) { // init curr at first time
    current = key;
    keys = [key];
  }

  var blockName = this.name + current;
  var values = store.get(blockName);
  var that = this;

  LZString.decompress(values, function(values) {
    values ? values = JSON.parse(values) : values = {};
    values[key] = val;
    if (JSON.stringify(values).length > LIMIT) {
      that.keys.push(key);
      values = {}; // start new block
      values[key] = val;
    }
    LZString.compress(JSON.stringify(values), function(values) {
      store.set(blockName, values);
      cb();
    });
  });
};

/**
 * Get
 */

storage.get = function(key, cb) {
  key = prepareKey(key);
  getValues(key, function(err, values) {
    cb(null, values[key]);
  });
};

/**
 * Del
 */

storage.del = function(key, cb) {
  key = prepareKey(key);
  getValues(key, function(err, values, blockName) {
    if (!values[key]) return cb();
    delete values[key];
    LZString.compress(JSON.stringify(values), function(values) {
      store.set(blockName, values);
      cb();
    });
  });
};

/**
 * Helpers
 */

function prepareKey(key) {
  return typeof key === 'string' ? key : JSON.stringify(key);
}

function getValues(key, cb) {
  var curr = keys[0];
  for (var i = 0, len = keys.length; i < len; i++) {
    if (keys[i] > curr) break;
    else curr = keys[i];
  }
  var blockName = curr;
  var values = store.get(blockName);

  LZString.decompress(values, function(values) {
    values ? values = JSON.parse(values) : values = {};
    cb(null, values, blockName);
  });
}
