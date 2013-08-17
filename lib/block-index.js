var LZString = require('./vendor/lz-string');
var store    = require('store');
var LIMIT    = 1024*20; // 20kb

module.exports = BlockIndex;

function BlockIndex(name) {
  this.name = name;
  this.keys = store.get(this.name) || [];
  this.curr = this.keys[this.keys.length - 1];
}

BlockIndex.prototype.exists = function() {
  return !! store.get(this.name);
};

BlockIndex.prototype.init = function() {
  store.set(this.name, []);
};

BlockIndex.prototype.prepareKey = function(key) {
  return typeof key === 'string' ? key : JSON.stringify(key);
};

BlockIndex.prototype.put = function(key, val, cb) {
  key = this.prepareKey(key);
  if (!this.curr) { // init curr at first time
    this.curr = key;
    this.keys = [key];
  }
  var blockName = this.name + this.curr;
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

BlockIndex.prototype.get = function(key, cb) {
  key = this.prepareKey(key);
  this.getValues(key, function(err, values) {
    cb(null, values[key]);
  });
};

BlockIndex.prototype.del = function(key, cb) {
  key = this.prepareKey(key);
  this.getValues(key, function(err, values, blockName) {
    if (!values[key]) return cb();
    delete values[key];
    LZString.compress(JSON.stringify(values), function(values) {
      store.set(blockName, values);
      cb();
    });
  });
};

BlockIndex.prototype.getValues = function(key, cb) {
  var curr = this.keys[0];
  for (var i = 0, len = this.keys.length; i < len; i++) {
    if (this.keys[i] > curr) break;
    else curr = this.keys[i];
  }
  var blockName = this.name + curr;
  var values = store.get(blockName);

  LZString.decompress(values, function(values) {
    values ? values = JSON.parse(values) : values = {};
    cb(null, values, blockName);
  });
};
