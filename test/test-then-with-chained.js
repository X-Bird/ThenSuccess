var ThenSuccess = require('../thensuccess');

var counter = 0;
var p = new ThenSuccess(function(resolve) {
	setTimeout(function(){
		console.log('resolved question:%d after 1 second', ++counter);
		resolve(++counter);
	}, 1000);
});
var dummy;

p
.then(dummy, function(x){
	console.log('after resolve question:%d, do something', counter);
})
.then(function(x){
	console.log('after resolve question:%d, do something', counter);
})
.then(function(x){
	console.log('after resolve question:%d, do something', counter);
})
.then(function(x){
	console.log('after resolve question:%d, do something', counter);
})
.then(function(x){
	console.log('after resolve question:%d, do something', counter);
});

console.log('test done');