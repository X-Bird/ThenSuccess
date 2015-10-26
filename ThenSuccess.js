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

ThenSuccess.prototype.fullfillDirectly = function() {
	// todo: 
}

ThenSuccess.prototype.rejectDirectly = function() {
	// todo: 
}

ThenSuccess.prototype.afterTransition = function() {

	var queue;

	if (this.isPending()) return;

	this.isFullfilled()? 
		this._rejectedCallbacks = undefined :
	    this._fullfilledCallbacks = undefined;


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
	
	Utils.runAsync(this.afterTransition.bind(this));

}

// todo: this function need to be invoked recursively, be aware of stack overflow or redundancy of slef executions
ThenSuccess.prototype.resolve = function(x) {

	// 2.3.1
	if (this === x) {
		// reject promise with a TypeError as the reason
		// I think... it's better to reject here directly
		this._reason = new TypeError('...');
		this.transTo('rejected');
	}

	// 2.3.2
	else if (typeof x === 'ThenSuccess') {
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

		// 2.3.3.1
		// why here have to let then be x.then...? need asking vilic

		try {
			var thenHandler = x.then;

			// 2.3.3.3 // 这里一大块不解
			if (Utils.isFunction(thenHandler)) {
				thenHandler.call(x, function(result){
					// todo: mao shi wo hao xiang xu yao zai zhe ge di fang resolve yi xie dong xi 
				}, function(reason){
					// todo: reject here
				})
			}
			// 2.3.3.4 
			// if then is not a function, fufill promise with x
			else {
				this._value = x;
				this.transTo('fullfilled');
			}
		}
		catch (e) {
			// todo: this.rejectDirectly
		}

		

		
	}
	// 2.3.4
	else if (typeof x !== 'object' && typeof x !== 'function') {
		this._value = x;
		this.transTo('fullfilled');
	}
}



ThenSuccess.prototype.then = function(onFullfilled, onRejected) {
	if (Utils.isFunction(onFullfilled)) {
		if (this.isPending()) {
			this._fullfilledCallbacks.push(onFullfilled);
		}
		else {
			onFullfilled(this._value);
		}
	}
}


module.exports = ThenSuccess;