var ThenSuccess = require('../ThenSuccess');

var Promise = ThenSuccess;

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

