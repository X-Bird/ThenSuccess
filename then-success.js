// 先写一个 
// var a = new Promise(function(resolve, reject){ setTimeout(function(){ resolve('done') }, 1000); })
// a.then(callback1)
// a.then(callback2)
// a.then(callback3)

"use strict";

var defer = function() {
    var _pending = [], _value;

    return {
        resolve: function(value) {
            _value = value;

            for(var i=0, ii = _pending.length; i < ii; ++i) {
                _pending[i](_value);
            }

            _pending = undefined;

        },
        reject: function(){},
        promise: {
            then: function(callback){
                if (_pending) {
                    _pending.push(callback);
                }
            },
            fail: function(){}
        }
    };
}

var a = function() {
    var result = defer();

    setTimeout(function(){
        result.resolve('times out');
    }, 1000);

    return result.promise;
};

a().then(function(d) {
    console.log('1', d);
})
a().then(function(d) {
    console.log('2', d);
})
a().then(function(d) {
    console.log('3', d);
})


// var Promise = function(resolver) {

//     this._value;
//     this._reason;
//     this.pending = [];


//     resolver(this.resolve, this.reject);

// }

// Promise.prototype.resolve = function(value) {
//     console.log('asdf', this);
//     console.log(this.pending);
//     this._value = value;
//     for (var i = 0, ii = this.pending.length; i < ii; i++) {
//         this.pending[i](this._value);
//     }
//     this.pending = undefined;
// };

// Promise.prototype.reject = function(reason) {
//     this._reason = reason;
// };

// Promise.prototype.then = function(callback) {
//     // return {}
//     if (this.pending) {
//         this.pending.push(callback);
//     } else {
//         callback(_value);
//     }

//     // console.log(this);
// }

// var a = new Promise(function(resolve, reject) {
//     setTimeout(function() {
//         resolve('done')
//     }, 1000);
// })
// a.then(function(d) {
//     console.log(d);
// })
// a.then(function(d) {
//     console.log(d);
// })
// a.then(function(d) {
//     console.log(d);
// })