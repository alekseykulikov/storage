var test    = window.tape;
var store   = require('store');
var storage = require('storage');

test('#put value to the store', function(t) {
  store.clear();
  storage.put('key', 'value', function(err) {
    t.error(err);
    t.ok(store.get('.bkey'));
    t.deepEqual(store.get('.storage-keys'), ['.bkey']);
    t.end();
  });
});
