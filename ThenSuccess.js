/////

// thinking area

// var ThenSuccess = require('ThenSuccess');


/////

var Utils = {
	isFunction: function(x) {
		return x && typeof x === 'function';
	}
}


var ThenSuccess = function ThenSuccess(resolver) {
	var that = this;

	that._state = 0; // peding: 0 fullfiled: 1 rejected: -1
	that._value;
	that._fullfilledCallbacks = [];
	that._rejectedCallbacks = [];


	resolver(that.resolve.bind(this));

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

// transTo('fullfilled')
// transTo('rejected')
ThenSuccess.prototype.transTo = function(status) {
	if (status && status === 'fullfilled') {
		this._state = 1;
	}
	if (status && status === 'rejected') {
		this._state = -1;
	}
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
		if (x.isPending) {
			// todo: remain pending
		}

		// 2.3.2.2
		if (x.isFullfiled) {
			// todo: fullfilled this promise with the same value
		}

		// 2.3.2.3
		if (x.isRejected) {
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