
/**
 * Module dependencies
 */

var LZString  = require('./vendor/lz-string');
var store     = require('store');

/**
 * Expose `storage`
 */

module.exports = exports = {};

/**
 * Local variables
 */

var LIMIT  = 1024*20; // 20kb
var PREFIX = '.b';    // default prefix for every block
var KEYS   = '.storage-keys'; // name for storing keys

/**
 * Put `val` with `key` to the storage.
 * Put means add or replace.
 */

exports.put = function(key, val, cb) {
  key = prepareKey(key);
  getBlock(key, function(name, values, rawValues) {
    if (rawValues.length > LIMIT) {
      startNewBlock(key);
      values = {};
    }
    values[key] = val;
    saveBlock(name, values, cb);
  });
};

/**
 * Get value from the storage by `key`.
 */

exports.get = function(key, cb) {
  key = prepareKey(key);
  getBlock(key, function(name, values) { cb(null, values[key]) });
};

/**
 * Delete value by `key`
 */

exports.del = function(key, cb) {
  key = prepareKey(key);
  getBlock(key, function(name, values) {
    if (!values[key]) return cb(new Error('Not found'));
    delete values[key];
    saveBlock(name, values, cb);
  });
};

/**
 * Helpers
 */

function prepareKey(key) {
  return typeof key === 'string' ? key : JSON.stringify(key);
}

function startNewBlock(key) {
  var keys = store.get(KEYS) || [];
  keys.push(key);
  store.set(KEYS, keys);
}

function getBlock(key, cb) {
  var keys    = store.get('.storage-keys') || [];
  var current = keys[keys.length - 1];

  if (keys.length === 0) {
    startNewBlock(key);
    current = key;
  } else {
    for (var i = 0, len = keys.length; i < len; i++) {
      if (keys[i] > key) break;
      else current = keys[i];
    }
  }

  var name      = PREFIX + current;
  var rawValues = store.get(name) || '';

  LZString.decompress(rawValues, function(values) {
    values ? values = JSON.parse(values) : values = {};
    cb(name, values, rawValues);
  });
}

function saveBlock(name, values, cb) {
  LZString.compress(JSON.stringify(values), function(values) {
    store.set(name, values);
    cb();
  });
}
