## 1.5.0 / 2015-03-14

  * add [LICENSE](./LICENSE) file
  * deps: localForage@1.2.2

## 1.4.0 / 2015-01-06

  * deps: localForage@1.2.0

## 1.3.0 / 2014-11-26

  * use localForage@1.1.1 as node dependency
  * don't require polyfill-function-prototype-bind

## 1.2.0 / 2014-10-24

  * upgrade to localForage@1.1.1
  * use browserify instead of component(1)
  * use npm-scripts instead of Makefile

## 1.1.0 / 2014-09-10

  * update deps: promise@5.0.0 and localForage@0.9.2
  * fix browserify support

# 1.0.0 / 2014-07-23

  * rename npm to asyncstorage
  * API is stable

## 0.5.0 / 2014-07-10

  * upgrade to localForage@0.9.1
  * downgrade to promise@4.0.0 for localForage consitency

### 0.4.1 / 2014-06-06

  * npm republish

## 0.4.0 / 2014-06-06

  * remove async-each as deps
  * return promises
  * make storage function with optional callback
  * storage() is an alias for storage.count()
  * storage({ key: null }) actually removes record
  * improve docs

## 0.3.0 / 2014-06-06

  * use `storage` as a name of db
  * only get&count return result in callback
  * console.log result, when callback is missed

## 0.2.0 / 2014-06-02

  * update readme
  * remove package.json dependencies
  * remove storage(null, fn)
  * add storage.count()

## 0.1.0 / 2014-05-26

  * initial release
