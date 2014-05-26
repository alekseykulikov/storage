var expect = require('chai').expect;
var storage = require('../index');

describe('storage', function() {
  before(function() {
    if (!window.indexedDB) storage.forage.setDriver('localStorageWrapper');
  });

  beforeEach(function(done) {
    storage.clear(function(err) {
      if (err) return done(err);
      storage({
        foo: 7,
        bar: ['one', 'two', 'three'],
        baz: 'string'
      }, done);
    });
  });

  it('#get one key', function(done) {
    storage('foo', function(err, val) {
      expect(val).equal(7);
      done(err);
    });
  });

  it('#get many keys', function(done) {
    storage(['bar', 'baz'], function(err, res) {
      expect(res).length(2);
      expect(res[0]).eql(['one', 'two', 'three']);
      expect(res[1]).equal('string');
      done(err);
    });
  });

  it('#set one value', function(done) {
    storage(5, 50, function(err) {
      storage(5, function(err2, val) {
        expect(val).equal(50);
        done(err || err2);
      });
    });
  });

  it('#del key', function(done) {
    storage('foo', null, function(err) {
      storage('foo', function(err2, val) {
        expect(val).not.exist;
        done(err || err2);
      });
    });
  });

  it('#del many keys', function(done) {
    storage(['foo', 'bar'], null, function(err) {
      storage(['foo', 'bar'], function(err2, res) {
        expect(res[0]).not.exist;
        expect(res[1]).not.exist;
        done(err || err2);
      });
    });
  });

  it('batch update', function(done) {
    storage({
      foo: 10,
      bar: null,
      key: 'val'
    }, function(err) {
      storage(['foo', 'bar', 'key'], function(err2, res) {
        expect(res[0]).equal(10);
        expect(res[1]).not.exist;
        expect(res[2]).equal('val');
        done(err || err2);
      });
    });
  });

  it('expose 4 methods', function() {
    expect(storage.clear).exist;
    expect(storage.set).exist;
    expect(storage.get).exist;
    expect(storage.del).exist;
  });

  it('validates argument length', function() {
    expect(function() {
      storage(1);
    }).throw(/arguments/);
  });
});
