# AsyncChain

One developer's attempt to escape from callback hell. Define a chain of functions to be executed once some asynchronous process is ready to call a callback.

### What this is:

* Something of a thought experiment by the developer.

* A module that allows individual functions to be defined and executed in turn as a result of an asynchronous process. It aims to:
    * Allow deeply nested functions to be avoided.
    * Allow code to be more functional, with a single responsability.
    * Allow functions to avoid accepting parameters only to proxy them on to some other function.
    * Allow functions to avoid worrying about callbacks.

* Akin to [Async Waterfall](https://github.com/caolan/async#waterfall) (which is awesome and a part of the [Async.js](https://github.com/caolan/async) library) with some key differences:
    * Functions do not need to call a provided callback in order to progress the chain.
    * Functions to call are not defined in an array.

### What this is not:

* A proper [Javascript Promises](http://www.html5rocks.com/en/tutorials/es6/promises/) library, despite the use of `then` (in the linked article see the "Queuing asynchronous actions" section for similar conceptual behaviour).
* [Promises/A+ compliant](https://github.com/promises-aplus/promises-spec)