# Storage.js

  Fast, compressed, async, and sorted key-value storage on top of localStorage.

## Main features

  * **data compression**. You can store 25-50mb of data, instead of 5mb limit, thanks [lz-string](https://github.com/pieroxy/lz-string);
  * **block structure**. Data stores in 20kb blocks sorted by key. It helps to write fast iterators and batches, and avoid localStorage performance problems;
  * **async API** `put`, `get`, `del`, `batch`, `forEach`. Real works happen in web-workers, thanks [operative](https://github.com/padolsey/operative);

## Installation

    $ component install ask11/storage

## Example

```js
var storage = require('storage');

storage.put(1, 'Effective Javascript', function(err) {});
storage.put(2, 'Functional Javascript', function(err) {});
storage.put(3, 'Javascript Good Parts', function(err) {});

// get value by key
storage.get(1, function(err, val) {}); // 'Effective Javascript'
```

## API

  It support any type of key|val.

### storage.put(key, val, cb)
### storage.get(key, cb)
### storage.del(key, cb)
### storage.all(cb)
### storage.batch(ops, cb)

## Blocks API

### blocks.get(key, function(err, block) {})

## Development

  Requires component && component-test installed globally (npm install -g component component-test).

  * `component install --dev` - install dependencies
  * `component test` - ensure that all tests pass

## License

  Aleksey Kulikov, [MIT](http://ask11.mit-license.org/).
