var localForage = require('localforage');
var asyncEach = require('async-each');
var type = require('component-type');

/**
 * Expose `storage`.
 */

module.exports = storage;

/**
 * Functional proxy to get/set/del methods.
 *
 * @param {String|Array|Object} key
 * @param {Mixed|Null} val
 * @param {Function} cb
 */

function storage(key, val, cb) {
  switch (arguments.length) {
    case 3: return val === null
      ? del(key, cb)
      : set(key, val, cb);
    case 2: return type(key) == 'object'
      ? set(key, val)
      : get(key, val);
    default:
      throw new TypeError('Not valid arguments length');
  }
}

/**
 * Expose methods.
 */

storage.forage = localForage;
storage.clear = clear;
storage.get = get;
storage.set = set;
storage.del = del;

/**
 * Get `key`.
 *
 * @param {Array|Mixed} key
 * @param {Function} cb
 */

function get(key, cb) {
  type(key) != 'array'
    ? localForage.getItem(key).then(wrap(cb), cb)
    : asyncEach(key, get, cb);
}

/**
 * Set `val` to `key`.
 *
 * @param {Array|Mixed} key
 * @param {Mixed} val
 * @param {Function} cb
 */

function set(key, val, cb) {
  type(key) != 'object'
    ? localForage.setItem(key, val).then(wrap(cb), cb)
    : asyncEach(Object.keys(key), function(subkey, next) {
        set(subkey, key[subkey], next);
      }, val);
}

/**
 * Delete `key`.
 *
 * @param {Array|Mixed} key
 * @param {Function} cb
 */

function del(key, cb) {
  type(key) != 'array'
    ? localForage.removeItem(key).then(wrap(cb), cb)
    : asyncEach(key, del, cb);
}

/**
 * Clear.
 *
 * @param {Function} cb
 */

function clear(cb) {
  localForage.clear().then(wrap(cb), cb);
}

/**
 * Wrap promise style response to callback style.
 *
 * @param {Function} cb
 * @return {Function} cb
 */

function wrap(cb) {
  return function(res) { cb(null, res) };
}
