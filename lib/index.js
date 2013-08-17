
/**
 * Module dependencies.
 */

var defaults   = require('defaults');
var LevelDown  = require('abstract-leveldown');
var BlockIndex = require('./block-index');
var buffer     = require('../deps/abstract-leveldown/lib/buffer');
var utils      = require('../deps/abstract-leveldown/lib/utils');

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
  this.index = new BlockIndex(name);
}

LevelDown(Storage);

Storage.prototype._open = function(options, cb) {
  var isExists = this.index.exists();
  options = defaults(options, { createIfMissing: true, errorIfExists: false });

  if (!options.createIfMissing && !isExists) {
    cb(new Error('Storage does not exist'));
  } else if (options.errorIfExists && isExists) {
    cb(new Error('Storage already exists'));
  } else {
    if (options.createIfMissing && !isExists) this.index.init();
    cb();
  }
};

/**
 * Get object by `key`.
 */

Storage.prototype._get = function(key, options, cb) {
  options = defaults(options, { asBuffer: true });
  this.index.get(key, function(err, val) {
    if (err) return cb(err);
    if (val === undefined) return cb(new Error('NotFound: '));

    if (options.asBuffer) {
      val = buffer.strToBuffer(val);
    } else {
      try {
        val = JSON.parse(val);
      } catch (er) {}
    }
    cb(null, val);
  });
};

/**
 * Put - replace or create object by `key` with `val`.
 */

Storage.prototype._put = function(key, val, options, cb) {
  this.index.put(key, utils.toString(val), cb);
};

/**
 * Delete object by `key`.
 */

Storage.prototype._del = function(key, options, cb) {
  this.index.del(key, cb);
};
