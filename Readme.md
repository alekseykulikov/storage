# Storage.js

  Functional wrapper aroung localForage
  Async interface to `localForage` as one function with node-callback support.
  Inpired by https://github.com/yields/store

  причины создания:
  - мне не нравился странный callback синтаксис в localForage
  - мне нужен был batch support
  - хотелось упростить api работы с хранилищем до одной функции

## Installation

  It supports 3 package managers:

```
bower install storage
component install ask11/storage
npm install ask11-storage
```

  [Standalone build](https://github.com/ask11/storage/blob/master/storage.js) available as well.

```html
<script src="storage.js"></script>
<script>window.storage('key', fn);</script>
```

## Example

```js
// set
storage('key', 'val', function(err) {});
storage({ key: 'foo', key2: 'val2'}, , function(err) {});

// get
storage('key', function(err, val) {});
storage(['key', 'key2'], function(err, all) {}); // all.length == 2

// delete
storage('key', null, function(err) {});
storage(['key1', 'key2', 'key3'], null, function(err) {});
```

## API

### storage(key, fn)
### storage([key1, key2, ..., keyn], fn)
### storage(key, val, fn)
### storage({ key1: val1, key2: val2, key3: val3 }, fn)
### storage(key, null, fn)
### storage([key1, key2, ..., keyn], null, fn)
### storage(null, fn);
### storage.forage
### storage.get
### storage.set
### storage.del
### storage.clear

## License

  Aleksey Kulikov, [MIT](http://ask11.mit-license.org/).
