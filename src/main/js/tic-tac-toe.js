"use strict";

let Base = function () {
	let _ = Object.create (null);
	
	_.init = function (parameters) {
		// empty by default
	};
	
	_.new = function (parameters) {
		return Object.create (this).init (parameters);
	};
	
	return _;
} ();