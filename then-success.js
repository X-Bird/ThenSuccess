// 先写一个 
// var a = new Promise(function(resolve, reject){ setTimeout(function(){ resolve('done') }, 1000); })
// a.then(callback1)
// a.then(callback2)
// a.then(callback3)

"use strict";

var wrap = function(value) {

    // 有then方法就认为是个promise
    if (value && typeof value.then === 'function') {
        return value;
    }

    return {
        then: function(callback) {
            return wrap(callback(value));
        }
    }
}

var defer = function() {
    var _pending = [], _value;

    return {
        resolve: function(value) {

            if (_pending) {
                _value = wrap(value); 
                for (var i = 0, ii = _pending.length; i < ii; i++) {
                    _value.then(_pending[i]);
                }
                _pending = undefined;
            }
            // _value = value;

            // for(var i=0, ii = _pending.length; i < ii; ++i) {
            //     _pending[i](_value);
            // }

            // _pending = undefined;

        },
        reject: function(){},
        promise: {
            // 为了实现级联，需要 
            // 1. then 返回一个promise， 
            // 2. 这个promise的then方法的callback方法的value来自于上个promise的resovle出来的结果
            // 3. （这点不是自己想到的，是看文档的） 传递给 then 的callback 需要返回一个 promise 或者是 一个值
            then: function(callback){

                var result = defer();

                var _wrappedCallback = function(_value) {
                    result.resolve(callback(_value));
                };

                if (_pending) {
                    _pending.push(_wrappedCallback);
                }
                else {
                    _value.then(_wrappedCallback(_value));
                }

                return result.promise;
            },
            fail: function(){}
        }
    };
}


// 测试用例

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

a()
.then(function(d){ console.log('10', d); return '10'; })
.then(function(d){ console.log('9', d); return '9'; })
.then(function(d){ console.log('7', d); return '7'; })
.then(function(d){ console.log('8', d); return '8'; })
.then(function(d){ console.log('11', d); return '11'; })

// 另一种实现

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