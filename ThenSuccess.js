/////

// thinking area

// var ThenSuccess = require('ThenSuccess');


/////

var Utils = {
	isFunction: function(x) {
		return x && typeof x === 'function';
	},
	isObject: function(x) {
		return x && typeof x === 'object';
	},
	runAsync: function(fn) {
		setTimeout(fn, 0);
	}
}


var ThenSuccess = function ThenSuccess(resolver) {
	var that = this;

	that._state = 0; // peding: 0 fullfilled: 1 rejected: -1
	that._value;
	that._reason;
	that._fullfilledCallbacks = [];
	that._rejectedCallbacks = [];
	that._promiseQueue = [];


	try {
		resolver(that.resolve.bind(this));
	}
	catch(e) {
		// todo: reject with a reason here
	}



}

ThenSuccess.prototype.isPending = function() {
	return this._state === 0;
}

ThenSuccess.prototype.isRejected = function() {
	return this._state === -1;
}

ThenSuccess.prototype.isFullfilled = function() {
	return this._state === 1;
}

ThenSuccess.prototype.fullfillDirectly = function(value) {

	this._value = value;
	this.transTo('fullfilled');

}

ThenSuccess.prototype.rejectDirectly = function(reason) {

	this._reason = reason;
	this.transTo('rejected');

}

ThenSuccess.prototype.afterTransition = function() {

	var callbackQueue;

	if (this.isPending()) return;

	if (this.isFullfilled())
		this._rejectedCallbacks = undefined;
	else
	    this._fullfilledCallbacks = undefined;


	callbackQueue = this._rejectedCallbacks || this._fullfilledCallbacks;

	while(callbackQueue.length) {
		var c = callbackQueue.shift();

		try {
			c(this._value);
		}
		catch(e) {
			// todo: rejected in new promise?

			continue;
		}

		
	}

	while(this._promiseQueue.length) {
		var promise = this._promiseQueue.shift();

		try {
			if (this.isFullfilled()) {
				promise.fullfillDirectly(this._value);
			}
			else {
				promise.rejectDirectly(this._reason);
			}
		}
		catch(e) {
			// todo: ???

			continue;
		}
		
	}

	// for preventing memory leaking ?? 不知道有没有效，有没有必要。。。想不清楚。。。卧槽
	this._promiseQueue = undefined;


}

// transTo('fullfilled')
// transTo('rejected')
ThenSuccess.prototype.transTo = function(status) {

	this._state = status === 'fullfilled'? 1:-1;
	
	Utils.runAsync(this.afterTransition.bind(this));

}

// todo: this function need to be invoked recursively, be aware of stack overflow or redundancy of slef executions
ThenSuccess.prototype.resolve = function(x) {

	// 2.3.1
	if (this === x) {
		// reject promise with a TypeError as the reason
		// I think... it's better to reject here directly

		this.rejectDirectly(new TypeError('...'));
	}

	// 2.3.2
	else if (x instanceof ThenSuccess) {
		// adopt its state
		// 2.3.2.1
		if (x.isPending()) {
			// remain pending
		}

		// 2.3.2.2
		if (x.isFullfilled()) {
			// fullfilled this promise with the same value
			x.fullfillDirectly(this._value);
			
		}

		// 2.3.2.3
		if (x.isRejected()) {
			// eject this promise with the same reason
			x.rejectDirectly(this._reason);
		}
	}

	// 2.3.3
	// I think ... here may be the scenario of dealing with thenable ?
	else if (typeof x === 'object' || typeof x === 'function') {

		var thenHandler, 
			called = false;

		// 2.3.3.1
		// why here have to let then be x.then...? need asking vilic

		try {
			var thenHandler = x.then;

			// 2.3.3.3 // 这个地方有待深化理解
			if (Utils.isFunction(thenHandler)) {
				thenHandler.call(x, function(result){
			
					if (!called) {
						this.resolve(y);
						called = true;
					}

				}, function(reason){
					if (!called) {
						this.reject(reason);
						called = true;
					}
				});
			}
			// 2.3.3.4 
			// if then is not a function, fufill promise with x
			else {
				this.fullfillDirectly(x);
				called = true;
			}
		}
		catch (e) {
			// this.rejectDirectly

			if (!called) {
				this.rejectDirectly(e);
				called = true;
			}
		}

		
	}
	// 2.3.4
	else if (typeof x !== 'object' && typeof x !== 'function') {
		this.fullfillDirectly(x);
	}
}



ThenSuccess.prototype.then = function(onFullfilled, onRejected) {

	var nextPromise = new ThenSuccess();

	if (Utils.isFunction(onFullfilled)) {
		if (this.isPending()) {
			this._fullfilledCallbacks.push(onFullfilled);
		}
		// else {
		// 	onFullfilled(this._value);
		// }
	}

	if (Utils.isFunction(onRejected)) {
		if (this.isPending()) {
			this._rejectedCallbacks.push(onRejected);
		}
		// else {
		// 	onRejected(this._value);
		// }
	}

	this._promiseQueue.push(nextPromise);

	return nextPromise;
}


module.exports = ThenSuccess;