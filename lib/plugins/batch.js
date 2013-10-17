var map = require('map');

module.exports = function() {
  return function(storage, blocks) {

    /**
     * Batch operations in one transaction
     *
     * @param {Array} ops - has levelup semantic https://github.com/rvagg/node-levelup#batch
     * @param {Function} cb
     */

    storage.batch = function(ops, cb) {
      if (!Array.isArray(ops))
        return cb(new Error('`operations` must be array'));

      var keys = map(ops, 'key');

      blocks.mapKeys(keys, function(err, result) {
        if (err) return cb(err);

        ops.forEach(function(op) {
          var key   = op.key;
          var block = result[key];

          // sync operations
          op.type === 'put' ? block.put(key, op.val) : block.del(key);
        });

        blocks.save(cb); // end transaction
      });
    };
  };
};
