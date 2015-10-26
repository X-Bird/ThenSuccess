/////

// thinking area

// var ThenSuccess = require('ThenSuccess');


/////


var ThenSuccess = function ThenSuccess() {
	var that = this;

	that.state = 0; // peding: 0 fullfiled: 1 rejected: -1
	that.fullfilledCallbacks = [];
	that.rejectedCallbacks = [];


}

ThenSuccess.prototype.then = function(onFullfiled, onRejected) {}


module.exports = ThenSuccess;