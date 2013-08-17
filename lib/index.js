require('./process');

/**
 * Module dependencies.
 */

var store     = require('store');
var defaults  = require('defaults');
var LevelDown = require('abstract-leveldown').AbstractLevelDOWN;
var inherit   = require('inherit');
var slice     = Array.prototype.slice;

/**
 * Expose `Strorage`.
 */

module.exports = Storage;

/**
 * Constructor.
 *
 * @params {String} name
 * @params {Object} options
 * @api public
 */

function Storage(name, options) {
  if (typeof name !== 'string') throw new TypeError('name required');
  if (!options) options = {};
  this.name = name;
}

inherit(Storage, LevelDown);

Storage.prototype._open = function(options, cb) {
  var isExists = !! store.get(this.name);
  options = defaults(options, { createIfMissing: true, errorIfExists: false });

  if (!options.createIfMissing && !isExists) {
    cb(new Error('Storage does not exist'));
  } else if (options.errorIfExists && isExists) {
    cb(new Error('Storage already exists'));
  } else {
    if (options.createIfMissing && !isExists) store.set(this.name, {});
    cb();
  }
};

/**
 * Get object by `key`.
 */

Storage.prototype._get = async(function(key) {
  return store.get(getKey(this, key));
});

/**
 * Put - replace or create object by `key` with `val`.
 */

Storage.prototype._put = async(function(key, val) {
  return store.set(getKey(this, key), val);
});

/**
 * Delete object by `key`.
 */

Storage.prototype._del = async(function(key) {
  store.remove(getKey(this, key));
});

/**
 * Helper to emulate async call.
 * Essential for all methods.
 */

function async(getVal) {
  return function() {
    var that = this;
    var args = slice.call(arguments, 0);
    var cb   = args[args.length - 1];

    process.nextTick(function() {
      try {
        var res = getVal.apply(that, args.slice(0, -1));
        res ? cb(null, res) : cb(null);
      } catch (err) {
        cb(err);
      }
    });
  };
}

function getKey(that, key) {
  if (typeof key !== 'string') key = JSON.stringify(key);
  return that.name + key;
}
