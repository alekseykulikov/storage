
/**
 * Module dependencies.
 */

var store     = require('store');
var defaults  = require('defaults');
var LevelDown = require('abstract-leveldown');
var LZString  = require('./vendor/lz-string');
var buffer    = require('../deps/abstract-leveldown/lib/buffer');
var utils     = require('../deps/abstract-leveldown/lib/utils');

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

LevelDown(Storage);

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

Storage.prototype._get = function(key, options, cb) {
  options = defaults(options, { asBuffer: true });
  var val = store.get(getKey(this, key));
  if (val === undefined) return cb(new Error('NotFound: '));

  LZString.decompress(val, function(val) {
    if (options.asBuffer) val = buffer.strToBuffer(val);
    else {
      try {
        val = JSON.parse(val);
      } catch (er) {};
    }
    cb(null, val);
  });
};

/**
 * Put - replace or create object by `key` with `val`.
 */

Storage.prototype._put = function(key, val, options, cb) {
  key = getKey(this, key);
  LZString.compress(utils.toString(val), function(val) {
    store.set(key, val);
    cb();
  });
};

/**
 * Delete object by `key`.
 */

Storage.prototype._del = function(key, options, cb) {
  store.remove(getKey(this, key));
  cb();
};

function getKey(that, key) {
  if (typeof key !== 'string') key = JSON.stringify(key);
  return that.name + key;
}
