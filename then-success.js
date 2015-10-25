var Utils = {
    runAsync: function (fn) {
        setTimeout(fn, 0);
    },
    isFunction: function (val) {
        return val && typeof val === "function";
    },
    isObject: function (val) {
        return val && typeof val === "object";
    },
    isThenSuccess: function (val) {
        return val && val.constructor === ThenSuccess;
    }
};



var ThenSuccess = function(resolver) {

    "use strict";

    this._value;
    this._reason;
    this.pending = [];
    this.failedCallback = [];


    resolver(this.resolve.bind(this), this.reject.bind(this));

}

ThenSuccess.prototype.resolve = function(value) {

    this._value = value;
    for (var i = 0, ii = this.pending.length; i < ii; i++) {
        this.pending[i](this._value);
    }
    this.pending = undefined;
};

ThenSuccess.prototype.reject = function(reason) {
    this._reason = reason;
};

ThenSuccess.prototype.then = function(onFulfilled, onRejected) {
    // return {}

    if ( Utils.isFunction(onFulfilled) ) {
        if (this.pending) {
            this.pending.push(onFulfilled);
        } else {
            onFulfilled(this._value);
        }
    }

    if ( Utils.isFunction(onRejected) ) {
        if (this.failedCallback) {
            this.failedCallback.push(onFulfilled);
        } else {
            onRejected(this._value);
        }
    }

}

ThenSuccess.prototype.fail = function(rejectedHandler) {}

ThenSuccess.prototype.spread = function(onFulfilled, onRejected) {}
ThenSuccess.prototype.catch = function() {}

var a = new ThenSuccess(function(resolve, reject) {
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