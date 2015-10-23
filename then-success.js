// 先写一个 
// var a = new Promise(function(resolve, reject){ setTimeout(function(){ resolve('done') }, 1000); })
// a.then(callback1)
// a.then(callback2)
// a.then(callback3)

"use strict";

var Promise = function(resolver) {

    this._value;
    this._reason;
    this.pending = [];


    resolver(this.resolve, this.reject);

}

Promise.prototype.resolve = function(value) {
    console.log('asdf', this);
    console.log(this.pending);
    this._value = value;
    for (var i = 0, ii = this.pending.length; i < ii; i++) {
        this.pending[i](this._value);
    }
    this.pending = undefined;
};

Promise.prototype.reject = function(reason) {
    this._reason = reason;
};

Promise.prototype.then = function(callback) {
    // return {}
    if (this.pending) {
        this.pending.push(callback);
    } else {
        callback(_value);
    }

    // console.log(this);
}

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