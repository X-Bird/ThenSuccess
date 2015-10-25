var Utils = {
    runAsync: function(fn) {
        setTimeout(fn, 0);
    },
    isFunction: function(val) {
        return val && typeof val === "function";
    },
    isObject: function(val) {
        return val && typeof val === "object";
    },
    isThenSuccess: function(val) {
        return val && val.constructor === ThenSuccess;
    }
};



var ThenSuccess = function(resolver) {

    "use strict";

    // 这样就不用bind了
    var that = this;

    this.value = null;
    this.state = 0; // 0: pending, 1: fullfilled, -1: rejected
    this.queue = [];
    this.handlers = {
        fulfill: null,
        reject: null
    };

    if (resolver) {
        resolver(function(value) {
            Resolve(that, value);
        }, function(reason) {
            that.reject(reason);
        });
    }

}

function Resolve (promise, x) {
// ThenSuccess.prototype.resolve = function(value) {

    // promise A+ 2.3.1
    if (promise === x) {
        // todo: reject here
        throw new TypeError("The promise and its value refer to the same object");
    } else if (Utils.isThenSuccess(x)) {

         if (x.state === 0) {
            x.then(function (val) {
                Resolve(promise, val);
            }, function (reason) {
                // todo: 记录reason, turn rejected
            });
        } else {
            // 如果不是 pending， 转化状态
            // todo: turn state here
        }
    }

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

    if (Utils.isFunction(onFulfilled)) {
        if (this.pending) {
            this.pending.push(onFulfilled);
        } else {
            onFulfilled(this._value);
        }
    }

    if (Utils.isFunction(onRejected)) {
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