var ThenSuccess = require('../thensuccess');

module.exports = {

    deferred: function () {
        var promise = new ThenSuccess();
        return {
            promise: promise,
            resolve: function (value) {
                promise.resolve(value);
            },
            reject: function (reason) {
                promise.reject(reason);
            },
            then: function(onFullfiled, onRejected) {
                promise.then(onFullfiled, onRejected);
            }
        };
    }
};

