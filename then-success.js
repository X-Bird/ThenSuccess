var Promise = function(resolver) {

    "use strict";

    this._value;
    this._reason;
    this.pending = [];
    this.failedCallback = [];


    resolver(this.resolve.bind(this), this.reject.bind(this));

}

Promise.prototype.resolve = function(value) {

    this._value = value;
    for (var i = 0, ii = this.pending.length; i < ii; i++) {
        this.pending[i](this._value);
    }
    this.pending = undefined;
};

Promise.prototype.reject = function(reason) {
    this._reason = reason;
};

Promise.prototype.then = function(onFulfilled, onRejected) {
    // return {}

    if (onFulfilled && typeof onFulfilled === 'function') {
        if (this.pending) {
            this.pending.push(onFulfilled);
        } else {
            onFulfilled(this._value);
        }
    }

    if (onRejected && typeof onRejected === 'function') {
        if (this.failedCallback) {
            this.failedCallback.push(onFulfilled);
        } else {
            onRejected(this._value);
        }
    }

}

Promise.prototype.fail = function(rejectedHandler) {}

Promise.prototype.spread = function(onFulfilled, onRejected) {}
Promise.prototype.catch = function() {}

var a = new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve('done')
    }, 1000);
})
a.then(function(d) {
    console.log(d);
})
a.then(function(d) {
    console.log(d);
})
a.then(function(d) {
    console.log(d);
})