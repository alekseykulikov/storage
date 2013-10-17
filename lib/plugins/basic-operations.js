// All this methods are just a proxy for blocks API.

module.exports = function() {
  return function(storage, blocks) {
    /**
     * Put `val` with `key` to the storage.
     * Put means add or replace.
     *
     * @param {Mixed} key
     * @param {Mixed} val
     * @param {Function} cb
     */
    storage.put = delegate('put', blocks);

    /**
     * Delete value by `key`.
     *
     * @param {Mixed} key
     * @param {Function} cb
     */
    storage.del = delegate('del', blocks);

    /**
     * Get value from the storage by `key`.
     *
     * @param {Mixed} key
     * @param {Function} cb
     */
    storage.get = delegate('get', blocks);

    /**
     * Get all values from the storage.
     *
     * @param {Function} cb
     */
    storage.all = function(cb) { blocks.all(cb) };
  };
};

// Helper to delegate method call to the block
function delegate(method, blocks) {
  return function(key, val, cb) {
    blocks.get(key, function(err, block) {
      err ? cb(err) : block[method].call(block, key, val, cb);
    });
  };
}
