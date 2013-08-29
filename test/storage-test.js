describe('storage', function() {
  var expect  = window.chai.expect;
  var series  = window.async.series;
  var storage = require('storage');

  beforeEach(function() {
    localStorage.clear();
  });

  describe('basic operations', function() {
    beforeEach(function(done) {
      series([
        function(cb) { storage.put('key', 'value', cb); },
        function(cb) { storage.put([1], { name: 'object' }, cb); },
        function(cb) { storage.put(['doom', 3, [1, 2]], false, cb); },
        function(cb) { storage.put(null, undefined, cb); },
        function(cb) { storage.put(1, true, cb); },
      ], done);
    });

    it('sets .storage-keys', function() {
      expect(localStorage.getItem('.bkey')).exist;
      expect(localStorage.getItem('.storage-keys'), '.bkey');
    });

    it('#get values with different keys', function(done) {
      series([
        function(cb) { storage.get('key', cb); },
        function(cb) { storage.get([1], cb); },
        function(cb) { storage.get(['doom', 3, [1, 2]], cb); },
        function(cb) { storage.get(null, cb); },
        function(cb) { storage.get(1, cb); },
      ], function(err, results) {
        expect(results).length(5);
        expect(results).eql(['value', { name: 'object' }, false, undefined, true]);
        done(err);
      });
    });

    it('#del values by key', function(done) {
      series([
        function(cb) { storage.del('key', cb); },
        function(cb) { storage.del([1], cb); },
        function(cb) { storage.del(['doom', 3, [1, 2]], cb); },
        function(cb) { storage.del(null, cb); },
        function(cb) { storage.del(1, cb); },
      ], function(err) {
        expect(localStorage.getItem('.bkey')).equal('');
        storage.get('key', function(err2, val) {
          expect(val).undefined;
          done(err || err2);
        });
      });
    });
  });
});
