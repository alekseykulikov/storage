describe('storage', function() {
  var expect  = window.chai.expect;
  var storage = require('storage');
  var get     = localStorage.getItem;

  beforeEach(function() {
    localStorage.clear();
  });

  it('#put value to the store', function(done) {
    storage.put('key', 'value', function(err) {
      expect(get('.bkey')).exist;
      expect(get('.storage-keys'), '.bkey');
      done(err);
    });
  });
});
