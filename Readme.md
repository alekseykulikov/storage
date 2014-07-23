# Storage [![Build Status](https://travis-ci.org/alekseykulikov/storage.png?branch=master)](https://travis-ci.org/alekseykulikov/storage)

  Storage is a functional wrapper around [localForage](https://github.com/mozilla/localForage).
  That means it's an asynchronous browser storage with multiple back-ends (IndexedDB, WebSQL, localStorage),
  which is built for a better offline experience.

  The main differences with localForage:

  - batch support
  - error first node-style callbacks, [fixes #55](https://github.com/mozilla/localForage/issues/55)
  - simple API inspired by [yields/store](https://github.com/yields/store)
  - optional callbacks, return promises
  - development mode

## Installation

```
$ bower install storage
$ component install alekseykulikov/storage
$ npm install asyncstorage --save
```

  Standalone build available as [storage.js](https://github.com/alekseykulikov/storage/blob/master/storage.js).

```html
<script src="storage.js"></script>
<script>window.storage('key', fn);</script>
```

## Example

```js
// set
storage.set('foo', 'val', fn);
storage.set({ foo: 'val', bar: 'baz' }, fn);

// get
storage.get('foo', fn); // 'val'
storage.get(['foo', 'bar'], fn); // ['val', 'baz']

// delete
storage.del('foo', fn)
storage.del(['foo', 'bar', 'baz'], fn);
```

## API

  Each method returns promise, and accepts optional callback.

### storage([key, val, fn])

  Main function is facade to get/set/del/count methods. It's inspired by [yields/store](https://github.com/yields/store).
  Setting a key to `null` is equivalent to deleting the key via `storage.del(key)`.

```js
// set
storage({ key: 'val', key2: 'val2'}, function(err) {});

// get
storage('key', function(err, val) {});
storage(['key', 'key2'], function(err, all) {}); // all.length == 2

// count
storage(function(err, count) {}); // count == 2

// delete
storage('key', null, function(err) {});
storage(['key', 'key2'], null, function(err) {});
```

### storage.get(key, [fn])

  Get `key` value.

### storage.get([key1, key2, ..., keyn], [fn])

  Get group of values. Callbacks return array of values for each key.
  If key does not exist, it returns `null` on this position.

### storage.set(key, val, [fn])

  Set `key` to `val`.
  You can store any kind of data, including [blobs](https://hacks.mozilla.org/2014/02/localforage-offline-storage-improved/).

### storage.del(key, [fn])

  Delete `key`.

### storage.set({ key1: val1, key2: val2, key3: val3 }, [fn])

  Run a batch operation.
  Simple way to create, update, remove multiple records.
  Use `null` to remove record.

```js
// assume we have 2 records
storage('foo', 7, fn)
storage('bar', ['one', 'two', 'three'], fn);

storage({
  baz: 'val' // create new val
  foo: 1000, // update `foo` value
  bar: null, // remove `bar`
}, function(err) {});
```

### storage.del([key1, key2, ..., keyn], [fn])

  Delete a group of keys in one request.

### storage.clear()

  Clear storage.

### storage.count()

  Count records.

### storage.development

  Work with async storage in developer console can be unpleasant.
  Setup development flag and storage will console.log() results of `get` or `count`.

```js
storage.development = true;
storage.set({ foo: 1, bar: 2 });
storage.get(['foo', 'bar']);
// => [1 ,2]
storage.del('bar');
storage.count();
// => 1
// shortcut to: storage.count().then(console.log.bind(console));
```

### storage.forage

  It gives you access to the localForage instance.
  You can use it to configure backend.
  By default storage setups only `name` option as `storage`.

```js
storage.forage.config({ name: 'my-name' });
if (!window.indexedDB) storage.forage.setDriver('localStorageWrapper');
```

## License

  Aleksey Kulikov, [MIT](http://alekseykulikov.mit-license.org/).
