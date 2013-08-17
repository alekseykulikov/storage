# Storage.js

  Fast, compressed, sorted key-value storage, or [LevelDB](https://code.google.com/p/leveldb/) on localStorage.

## Main features

  * **data compression**. You can store 25-50mb of data, instead of 5mb limit, thanks [lz-string](https://github.com/pieroxy/lz-string);
  * **block structure**. Data stores in 20kb blocks sorted by key. It helps to write fast iterators and batches, and avoid localStorage performance problems;
  * **simple async API** `put`, `get`, `del`, `batch`, `iterator`. Real works happen in web-workers, thanks [operative](https://github.com/padolsey/operative);
  * **[levelDown](https://github.com/rvagg/node-leveldown/) compatibality**. It can be used as backend for [levelup](https://github.com/rvagg/node-levelup/) so you can extend storage with a long list of [modules](https://github.com/rvagg/node-levelup/wiki/Modules).
  * **IE6+ support**. It use time-tested [store.js](https://github.com/marcuswestin/store.js) as localStorage wrapper for all browsers without using cookies or flash.

## Installation

    $ component install ask11/storage

## Example

```js
var Storage = require('storage');
var books   = new Storage('books');

books.put(1, 'Effective Javascript', function(err) {});
books.put(2, 'Functional Javascript', function(err) {});
books.put(3, 'Javascript Good Parts', function(err) {});

// get value by key
books.get(1, function(err, val) {}); // 'Effective Javascript'
```

## License

  Aleksey Kulikov, [MIT](http://ask11.mit-license.org/).
