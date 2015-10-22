/*
todo:
* travis ci
* local running tests 
* 
*/

(function(definition) {
	"use strict"; // ## 最好把开启严格模式的指令作用于函数中 ，不要用于全局，提高兼容性，预防第三方代码没有考虑这个问题

	/*
	* 类似这种地方是不是可以不用了解太多，直接就是照抄就行？虽然看得懂
	*/

	// This file will function properly as a <script> tag, or a module
	// using CommonJS and NodeJS or RequireJS module formats.  In
	// Common/Node/RequireJS, the module exports the Q API and when
	// executed as a simple <script>, it creates a Q global instead.

	// Montage Require
	if (typeof bootstrap === "function") {
		bootstrap("promise", definition);

		// CommonJS
	} else if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition();

		// ?? 为什么 nodejs 加载会落入这个地方？

		// RequireJS
	} else if (typeof define === "function" && define.amd) {
		define(definition);

		// SES (Secure EcmaScript)
	} else if (typeof ses !== "undefined") {
		if (!ses.ok()) {
			return;
		} else {
			ses.makeQ = definition;
		}

		// <script>
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		// Prefer window over self for add-on scripts. Use self for
		// non-windowed contexts.
		var global = typeof window !== "undefined" ? window : self;

		// Get the `window` object, save the previous Q global
		// and initialize Q as a global.
		var previousQ = global.Q;
		global.Q = definition();

		// Add a noConflict function so Q can be removed from the
		// global namespace.
		global.Q.noConflict = function() {
			global.Q = previousQ;
			return this;
		};

	} else {
		throw new Error("This environment was not anticipated by Q. Please file a bug.");
	}

})()