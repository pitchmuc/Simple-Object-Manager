# Release of Simple Object Manager

This page will provide all the release note when a version or subversion of the library has been pushed.
This is keeping tracked of the release since version 0.1.0.

## v 1.0.5
Protecting Som from prototype injection for assign, merge and mergeDeep methods.

## v 1.0.4
* adding `WeakSet` capability in `replace` and `searchValue` methods to avoid infinte loop when trying to replace or search a value that is in the same object as the one we are trying to replace or search. It was causing an infinite loop and crashing the application. Now it will return the original value if it is in the same object as the one we are trying to replace or search.

## v 1.0.3
* fix edge case when data returned are `0` or fallback is `0`. It was returning undefined.

## v 1.0.1
* support on possibility to force type when assigning
* support `Set` object
* refactor the `override` possibility on assign

## v 1.0.0 release
* went live with the official version of SOM.
  capabilities:
  * assign
  * get
  * merge
  * mergeDeep
  * push
  * search
  * subSom
  * getSubNodes
  * stack capability

## v 0.1.4

* adding a `search` method
* adding the `subSom` method to create a new som from a node of the SOM.
* adding the `getSubNodes`  method to return all existing sub nodes as SOM instance.

## v 0.1.3

* Adding the `stack` capability and variable
* migrating the parameters into the `options` objects

## v 0.1.1

* adding functionality that an array can be passed with different references in the `get` method.