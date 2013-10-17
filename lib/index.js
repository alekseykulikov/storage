
/**
 * Expose `storage`.
 */

var storage = module.exports = Object.create(null);

/**
 * Local variables.
 */

var blocks = require('./blocks');
var used   = [];

/**
 * Use the given plugin `fn(storage, blocks)`.
 *
 * @param {Function} fn
 * @return {Storage}
 */

storage.use = function(fn) {
  if (!~used.indexOf(fn)) {
    fn(storage, blocks);
    used.push(fn);
  }
  return storage;
};

// use build-in plugins
storage.use(require('./plugins/basic-operations')());
storage.use(require('./plugins/batch')());
