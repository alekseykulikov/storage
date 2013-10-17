
/**
 * Module dependencies
 */

var LZString  = require('./vendor/lz-string');
var Promise   = require('promise');
var map       = require('map');
var each      = require('each');
var type      = require('type');
var asyncEach = require('async-each');

/**
 * Expose `storage`
 */

module.exports = exports = {};

/**
 * Constants
 */

var LIMIT     = 1024*20;         // 20kb
var PREFIX    = '.b';            // default prefix for every block
var KEYS      = '.storage-keys'; // namespace for storing keys
var SEPARATOR = '~';             // keys separator

/**
 * Put `val` with `key` to the storage.
 * Put means add or replace.
 */

exports.put = Promise.denodeify(function(key, val, cb) {
  key = prepareKey(key);
  getBlock(key, function(err, res) {
    put(res, key, val);
    saveBlock(res, cb);
  });
});

/**
 * Get value from the storage by `key`.
 */

exports.get = Promise.denodeify(function(key, cb) {
  key = prepareKey(key);
  getBlock(key, function(err, res) {
    cb(null, res.values[key]);
  });
});

/**
 * Delete value by `key`
 */

exports.del = Promise.denodeify(function(key, cb) {
  key = prepareKey(key);
  getBlock(key, function(err, res) {
    if (err) return cb(err);
    del(res, key);
    saveBlock(res, cb);
  });
});

/**
 * Batch operations in one transaction
 * `ops` has levelup semantic
 * https://github.com/rvagg/node-levelup#batch
 */

exports.batch = Promise.denodeify(function(ops, cb) {
  if (type(ops) !== 'array') return cb(new Error('`operations` must be array'));
  var keys      = map(ops, 'key');
  var blocks    = [];
  var keysMap   = {};
  var blocksMap = {};

  // get block's names for change
  each(keys, function(key) {
    key = prepareKey(key);
    var name = getBlockName(key);
    keysMap[key] = name;
    if (!~blocks.indexOf(name)) {
      blocks.push(name);
      blocksMap[name] = blocks.length - 1;
    }
  });

  asyncEach(blocks, getBlockByName, function(err, blocks) {
    each(ops, function(op) {
      var key   = prepareKey(op.key);
      var index = blocksMap[keysMap[op.key]];
      var res   = blocks[index];
      op.type === 'put' ? put(res, key, op.value) : del(res, key);
    });
    asyncEach(blocks, saveBlock, cb);
  });
});

/**
 * Iterator
 */

exports.forEach = Promise.denodeify(function(fn, cb) {
  asyncEach(getKeys(), getBlock, function(err, blocks) {
    each(blocks, function(res) { each(res.values, fn) });
    cb();
  });
});

/**
 * Helpers
 */

function prepareKey(key) {
  return type(key) === 'string' ? key : JSON.stringify(key);
}

function getKeys() {
  var keys = localStorage.getItem(KEYS);
  return keys ? keys.split(SEPARATOR) : [];
}

function startNewBlock(key, keys) {
  if (!keys) keys = getKeys();
  keys.push(key);
  localStorage.setItem(KEYS, keys.join(SEPARATOR));
}

function getBlockName(key) {
  var keys    = getKeys();
  var current = keys[keys.length - 1];

  if (keys.length === 0) {
    startNewBlock(key, keys);
    current = key;
  } else {
    for (var i = 0, len = keys.length; i < len; i++) {
      if (keys[i] > key) break;
      else current = keys[i];
    }
  }

  return PREFIX + current;
}

function getBlock(key, cb) {
  getBlockByName(getBlockName(key), cb);
}

function getBlockByName(name, cb) {
  var raw = localStorage.getItem(name) || '';

  LZString.decompress(raw, function(values) {
    values ? values = JSON.parse(values) : values = {};
    cb(null, { values: values, raw: raw, name: name });
  });
}

function saveBlock(res, cb) {
  LZString.compress(JSON.stringify(res.values), function(values) {
    localStorage.setItem(res.name, values);
    cb();
  });
}

function put(res, key, val) {
  if (res.raw.length > LIMIT) {
    startNewBlock(key);
    res.values = {};
  }
  res.values[key] = val;
}

function del(res, key) {
  if (res.values[key] === undefined) return;
  delete res.values[key];
  if (Object.keys(res.values).length === 0) res.values = undefined;
}
