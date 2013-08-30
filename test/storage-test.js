describe('storage', function() {
  var expect  = window.chai.expect;
  var series  = window.async.series;
  var storage = require('storage');
  var Promise = require('promise');

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
      Promise.all(
        storage.get('key'),
        storage.get([1]),
        storage.get(['doom', 3, [1, 2]]),
        storage.get(null),
        storage.get(1)
      ).nodeify(function(err, results) {
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

    it('supports promises', function(done) {
      storage.put('foo', 'bar').then(function() {
        storage.get('foo').then(function(val) {
          expect(val).equal('bar');
          storage.del('foo').nodeify(done);
        });
      });
    });

    it('#batch many records', function(done) {
      var date = new Date().toString();
      var ops = [
        { type: 'del', key: 'key' },
        { type: 'put', key: [1], value: 'Keit' },
        { type: 'put', key: 'date', value: date },
        { type: 'del', key: 1 }
      ];
      storage.batch(ops, function(err) {
        Promise.all(
          storage.get('key'),
          storage.get([1]),
          storage.get(['doom', 3, [1, 2]]),
          storage.get('date'),
          storage.get(1)
        ).nodeify(function(err2, results) {
          expect(results).eql([undefined, 'Keit', false, date, undefined]);
          done(err || err2);
        });
      });
    });
  });
});
