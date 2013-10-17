window.mocha.setup({ timeout: 5000 });

describe('storage', function() {
  var expect  = require('chai').expect;
  var series  = require('async').series;
  var storage = require('storage');

  describe('simple operations - one block', function() {
    beforeEach(function(done) {
      localStorage.clear();
      series([
        function(cb) { storage.put('key', 'value', cb) },
        function(cb) { storage.put([1], { name: 'object' }, cb) },
        function(cb) { storage.put(['doom', 3, [1, 2]], false, cb) },
        function(cb) { storage.put(1, true, cb) },
      ], done);
    });

    it('sets .storage-keys', function() {
      expect(localStorage.getItem('.bkey')).exist;
      expect(localStorage.getItem('.storage-keys')).equal('key');
    });

    it('#get values with different keys', function(done) {
      series([
        function(cb) { storage.get('key', cb) },
        function(cb) { storage.get([1], cb) },
        function(cb) { storage.get(['doom', 3, [1, 2]], cb) },
        function(cb) { storage.get(1, cb) },
      ], function(err, results) {
        expect(results).length(4);
        expect(results).eql(['value', { name: 'object' }, false, true]);
        done(err);
      });
    });

    it('#del values by key', function(done) {
      series([
        function(cb) { storage.del('key', cb); },
        function(cb) { storage.del([1], cb); },
        function(cb) { storage.del(['doom', 3, [1, 2]], cb); },
        function(cb) { storage.del(1, cb); },
      ], function(err) {
        expect(localStorage.getItem('.bkey')).equal('');
        storage.get('key', function(err2, val) {
          expect(val).undefined;
          done(err || err2);
        });
      });
    });

    it('#all values', function(done) {
      storage.all(function(err, values) {
        expect(Object.keys(values)).length(4);
        expect(values.key).equal('value');
        expect(values[1]).equal(true);
        done(err);
      });
    });

    xit('#batch many records', function(done) {
      var date = new Date().toString();
      var ops = [
        { type: 'del', key: 'key' },
        { type: 'put', key: [1], value: 'Keit' },
        { type: 'put', key: 'date', value: date },
        { type: 'del', key: 1 }
      ];
      storage.batch(ops, function(err) {
        series([
          function(cb) { storage.get('key', cb) },
          function(cb) { storage.get([1], cb) },
          function(cb) { storage.get(['doom', 3, [1, 2]], cb) },
          function(cb) { storage.get('date', cb) },
          function(cb) { storage.get(1, cb) }
        ], function(err2, results) {
          expect(results).eql([undefined, 'Keit', false, date, undefined]);
          done(err || err2);
        });
      });
    });
  });

  xdescribe('massive operations - many blocks', function() {
    function size(obj) {
      var len = JSON.stringify(obj).length * 2;
      return (len / (1024*1024)).toFixed(2) + 'Mb';
    }

    before(function(done) {
      localStorage.clear();

      var ops = [];
      for (var i = 0; i < 100000; i++)
        ops.push({ type: 'put', key: i, value: 'item' + i });

      console.log('store: ' + size(ops) + ' of data.');
      storage.batch(ops, done);
    });

    it('sets .storage-keys', function() {
      expect(localStorage.getItem('.b0')).exist;
      expect(localStorage.getItem('.storage-keys')).equal('0');
      expect(size(localStorage)).equal('0.56Mb');
    });

    it('stores all data', function(done) {
      storage.all(function(err, values) {
        expect(Object.keys(values)).length(100000);
        done(err);
      });
    });

    it('support #get', function(done) {
      storage.get(50000, function(err, val) {
        expect(val).equal('item50000');
        done(err);
      });
    });
  });
});
