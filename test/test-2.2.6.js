var deferred = require('./adapter').deferred;

var sentinel, value;

var promise = deferred().promise;
promise.resolve(value);

console.log('1111111');
console.log(promise);
promise
.then(function() {
	console.log('come here');
	return sentinel;
})
.then(function(value) {
	console.log(value, sentinel);
});


// promise.then(function() {
// 	throw sentinel2;
// }).then(null, function(reason) {
// 	assert.strictEqual(reason, sentinel2);
// 	semiDone();
// });

// promise.then(function() {
// 	return sentinel3;
// }).then(function(value) {
// 	assert.strictEqual(value, sentinel3);
// 	semiDone();
// });