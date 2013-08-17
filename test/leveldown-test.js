/**
 * Test compatibility with LevelDown API
 */

(function() {
  var tape       = window.tape;
  var Storage    = require('storage');
  var testBuffer = require('ask11-node-abstract-leveldown/lib/buffer').strToBuffer('foo');
  var testCommon = {};

  function factory(location) {
    return new Storage(location, { levelDown: true });
  }

  var index = 0;
  testCommon.location = function() { return 'test' + index++; };
  testCommon.setUp =
  testCommon.tearDown = function(t) {
    index = 0;
    localStorage.clear();
    t.end();
  };

  require('abstract-leveldown/abstract/leveldown-test').args(factory, tape, testCommon);
  require('abstract-leveldown/abstract/open-test').all(factory, tape, testCommon);
  require('abstract-leveldown/abstract/close-test').close(factory, tape, testCommon);
  require('abstract-leveldown/abstract/put-test').all(factory, tape, testCommon);
  require('abstract-leveldown/abstract/del-test').all(factory, tape, testCommon);
  require('abstract-leveldown/abstract/get-test').all(factory, tape, testCommon);
  require('abstract-leveldown/abstract/put-get-del-test').all(factory, tape, testCommon, testBuffer);
  // require('abstract-test-suite/abstract/batch-test').all(factory, tape, testCommon);
  // require('abstract-test-suite/abstract/chained-batch-test').all(factory, tape, testCommon);
  // require('abstract-test-suite/abstract/iterator-test').all(factory, tape, testCommon);
}).call(this);
