var localForage = require('localforage');
var Promise = require('promise');
var type = require('component-type');

/**
 * Setup `localForage`.
 */

localForage.config({
  name: 'storage'
});

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
  var length = arguments.length;
  if (type(arguments[length - 1]) != 'function') length += 1;

  switch (length) {
    case 3: return val === null
      ? del(key, cb)
      : set(key, val, cb);
    case 2: return type(key) == 'object'
      ? set(key, val)
      : get(key, val);
    default:
      return count(key);
  }
}

/**
 * Expose methods.
 */

storage.forage = localForage;
storage.get = get;
storage.set = set;
storage.del = del;
storage.count = count;
storage.clear = clear;

/**
 * Get `key`.
 *
 * @param {Array|Mixed} key
 * @param {Function} cb
 */

function get(key, cb) {
  return type(key) != 'array'
    ? localForage.getItem(key).then(wrap(cb, true), cb)
    : Promise.all(key.map(getSubkey)).then(wrap(cb, true), cb);

  function getSubkey(key) {
    return get(key, function() {}); // noob function to prevent logs
  }
}

/**
 * Set `val` to `key`.
 *
 * @param {Array|Mixed} key
 * @param {Mixed} val
 * @param {Function} cb
 */

function set(key, val, cb) {
  return type(key) != 'object'
    ? localForage.setItem(key, val).then(wrap(cb), cb)
    : Promise.all(Object.keys(key).map(setSubkey)).then(wrap(val), val);

  function setSubkey(subkey, next) {
    return set(subkey, key[subkey], next);
  }
}

/**
 * Delete `key`.
 *
 * @param {Array|Mixed} key
 * @param {Function} cb
 */

function del(key, cb) {
  return type(key) != 'array'
    ? localForage.removeItem(key).then(wrap(cb), cb)
    : Promise.all(key.map(del)).then(wrap(cb), cb);
}

/**
 * Clear.
 *
 * @param {Function} cb
 */

function clear(cb) {
  return localForage.clear().then(wrap(cb), cb);
}

/**
 * Count records.
 *
 * @param {Functionc} cb
 */

function count(cb) {
  return localForage.length().then(wrap(cb, true), cb);
}

/**
 * Wrap promise style response to callback style.
 * If `cb` does not specified use console.log to display result.
 *
 * @param {Function} cb
 * @param {Boolean} [hasResult]
 * @return {Function}
 */

function wrap(cb, hasResult) {
  return function(res) {
    if (type(cb) == 'function') {
      hasResult ? cb(null, res) : cb();
    } else if (hasResult) {
      console.log(res);
    }
    return res;
  };
}
