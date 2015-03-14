var expect = require('chai').expect;
var storage = require('../lib');

describe('storage', function() {
  before(function() {
    if (!Function.prototype.bind) Function.prototype.bind = require('function-bind');
    if (!window.indexedDB) storage.forage.setDriver(storage.forage.LOCALSTORAGE);
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
      if (err) return done(err);
      expect(val).equal(7);
      done();
    });
  });

  it('#get many keys', function(done) {
    storage(['bar', 'baz'], function(err, res) {
      if (err) return done(err);
      expect(res).length(2);
      expect(res[0]).eql(['one', 'two', 'three']);
      expect(res[1]).equal('string');
      done();
    });
  });

  it('#set one value', function(done) {
    storage('5', 50, function(err) {
      storage('5', function(err2, val) {
        if (err || err2) return done(err || err2);
        expect(val).equal(50);
        done();
      });
    });
  });

  it('#del key', function(done) {
    storage('foo', null, function(err) {
      storage('foo', function(err2, val) {
        if (err || err2) return done(err || err2);
        expect(val).not.exist;
        done();
      });
    });
  });

  it('#del many keys', function(done) {
    storage(['foo', 'bar'], null, function(err) {
      storage(['foo', 'bar'], function(err2, res) {
        if (err || err2) return done(err || err2);
        expect(res[0]).not.exist;
        expect(res[1]).not.exist;
        done();
      });
    });
  });

  it('#count', function(done) {
    storage.count(function(err, count) {
      if (err) return done(err);
      expect(count).equal(3);
      done();
    });
  });

  it('batch update', function(done) {
    storage({
      foo: 10,
      bar: null,
      key: 'val'
    }, function(err) {
      storage(['foo', 'bar', 'key'], function(err2, res) {
        if (err || err2) return done(err || err2);
        expect(res[0]).equal(10);
        expect(res[1]).not.exist;
        expect(res[2]).equal('val');
        done();
      });
    });
  });

  it('supports promises', function(done) {
    storage.get(['foo', 'bar', 'baz']).then(function(res) {
      expect(res).length(3);
      expect(res).eql([7, ['one', 'two', 'three'], 'string']);
      storage.del(['bar'], function(res) {
        expect(res).not.exist;
        storage().then(function(count) {
          expect(count).equal(2);
          storage.clear().then(done);
        });
      });
    });
  });

  it('expose 5 methods', function() {
    expect(storage.clear).exist;
    expect(storage.set).exist;
    expect(storage.get).exist;
    expect(storage.del).exist;
    expect(storage.count).exist;
  });

  it('callback is optional', function(done) {
    storage.set('foo', 1);
    storage.set('bar', 2);
    storage.del('baz');
    setTimeout(function() {
      storage(['foo', 'bar', 'baz'], function(err, res) {
        if (err) return done(err);
        expect(res).eql([1, 2, null]);
        done();
      });
    }, 30);
  });

  it('exposes localForage for advanced methods', function(done) {
    storage.forage.keys().then(function(keys) {
      expect(keys.sort()).eql(['bar', 'baz', 'foo']);
      done();
    });
  });
});
