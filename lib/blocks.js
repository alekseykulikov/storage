var LZString  = require('./vendor/lz-string');
var asyncEach = require('async-each');

/**
 * Constants.
 */

var LIMIT     = 1024*20;         // 20kb
var PREFIX    = '.b';            // default prefix for every block
var KEYS      = '.storage-keys'; // namespace for storing keys
var SEPARATOR = '~';             // keys separator

exports.get = function(key, cb) {
  getBlockByName(getBlockName(key), cb);
};

exports.all = function(cb) {
  cb(null, []);
};

function Block(options) {
  this.values = options.values;
  this.raw    = options.raw;
  this.name   = options.name;
}

Block.prototype.put = function(key, val, cb) {
  key = prepareKey(key);
  if (this.raw.length > LIMIT) {
    startNewBlock(key);
    this.values = {};
  }
  this.values[key] = val;
  saveBlock(this, cb);
};

Block.prototype.del = function(key, cb) {
  key = prepareKey(key);
  if (this.values[key] === undefined) return;
  delete this.values[key];
  if (Object.keys(this.values).length === 0) this.values = undefined;
  saveBlock(this, cb);
};

Block.prototype.get = function(key, cb) {
  cb(null, this.values[prepareKey(key)]);
};

/**
 * Helpers
 */

function mapKeys(keys) {
  var blocks    = [];
  var keysMap   = {};
  var blocksMap = {};

  // get blocks for change
  keys.forEach(function(key) {
    key = prepareKey(key);
    var name = getBlockName(key);
    keysMap[key] = name;

    if (!~blocks.indexOf(name)) {
      blocks.push(name);
      blocksMap[name] = blocks.length - 1;
    }
  });

  asyncEach(blocks, getBlockByName, function(err, blocks) {
    ops.forEach(function(op) {
      var key   = prepareKey(op.key);
      var index = blocksMap[keysMap[op.key]];
      var block = blocks[index];
      op.type === 'put' ? putValue(block, key, op.value) : delValue(block, key);
    });

    asyncEach(blocks, saveBlock, cb);
  });
}

function prepareKey(key) {
  return typeof key === 'string' ? key : JSON.stringify(key);
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

function getBlockByName(name, cb) {
  var raw = localStorage.getItem(name) || '';

  LZString.decompress(raw, function(values) {
    values ? values = JSON.parse(values) : values = {};
    cb(null, new Block({ values: values, raw: raw, name: name }));
  });
}

function saveBlock(block, cb) {
  LZString.compress(JSON.stringify(block.values), function(values) {
    localStorage.setItem(block.name, values);
    cb();
  });
}
