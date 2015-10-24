var ThenSuccess = require('../then-success');

var Promise = ThenSuccess.Promise;

module.exports = {

    deferred: function () {
        var promise = new Promise();
        return {
            promise: promise,
            resolve: function (value) {
                promise.resolve(value);
            },
            reject: function (reason) {
                promise.reject(reason);
            }
        };
    }
};