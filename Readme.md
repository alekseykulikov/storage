# Storage.js



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

## License

  Aleksey Kulikov, [MIT](http://ask11.mit-license.org/).
