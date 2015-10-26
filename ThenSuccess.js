/////

// thinking area

// var ThenSuccess = require('ThenSuccess');


/////

var Utils = {
	isFunction: function(x) {
		return x && typeof x === 'function';
	},
	runAsync: function(fn) {
		setTimeout(fn, 0);
	}
}


var ThenSuccess = function ThenSuccess(resolver) {
	var that = this;

	that._state = 0; // peding: 0 fullfiled: 1 rejected: -1
	that._value;
	that._reason;
	that._fullfilledCallbacks = [];
	that._rejectedCallbacks = [];


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

ThenSuccess.prototype.isFullfiled = function() {
	return this._state === 1;
}

ThenSuccess.prototype.afterTransition = function() {

	var queue;

	if (this.isPending()) return;

	this.isFullfiled()? this._rejectedCallbacks = undefined : this._fullfilledCallbacks = undefined;


	queue = this._rejectedCallbacks || this._fullfilledCallbacks;

	while(queue.length) {
		var queuePromise = queue.shift();

		try {
			queuePromise(this._value);
		}
		catch(e) {
			// todo: rejected in new promise?

			continue;
		}

		// todo: chain next promise with this._value?
	}

}

// transTo('fullfilled')
// transTo('rejected')
ThenSuccess.prototype.transTo = function(status) {

	this._state = status === 'fullfilled'? 1:-1;
	
	runAsync(this.afterTransition,bind(this));

}

ThenSuccess.prototype.resolve = function(x) {

	// 2.3.1
	if (this === x) {
		// todo: reject promise with a TypeError as the reason
	}

	// 2.3.2
	else if (typeof x === 'ThenSuccess') {
		// adopt its state
		// 2.3.2.1
		if (x.isPending()) {
			// todo: remain pending
		}

		// 2.3.2.2
		if (x.isFullfiled()) {
			// todo: fullfilled this promise with the same value
		}

		// 2.3.2.3
		if (x.isRejected()) {
			// todo: reject this promise with the same reason
		}
	}

	// 2.3.3
	else if (typeof x === 'object' || typeof x === 'function') {

		// 2.3.3.1 这个地方不解
		// if (x.then) {}

		// 2.3.3.2 这个地方不解

		// 2.3.3.3 // 这里一大块不解
	}
	// 2.3.4
	else if (typeof x !== 'object' && typeof x !== 'function') {
		this._value = x;
		this.transTo('fullfilled');
	}
}



ThenSuccess.prototype.then = function(onFullfiled, onRejected) {
	if (Utils.isFunction(onFullfiled)) {
		if (this.isPending()) {
			this._fullfilledCallbacks.push(onFullfiled);
		}
		else {
			onFullfiled(this._value);
		}
	}
}


module.exports = ThenSuccess;