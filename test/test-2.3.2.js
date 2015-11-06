var deferred = require('./adapter').deferred;


var f = function(){
	var d = deferred();

	setTimeout(function(){

		console.log('resolved something');
		d.resolve(1);
	}, 1000);

	return d.promise;
};

f()
.then(function(x){
	console.log('after resolve question:%d, do something', x);
})
.then(function(x){
	console.log('after resolve question:%d, do something', x);
})
.then(function(x){
	console.log('after resolve question:%d, do something', x);
})
.then(function(x){
	console.log('after resolve question:%d, do something', x);
})
.then(function(x){
	console.log('after resolve question:%d, do something', x);
});

console.log('test done');