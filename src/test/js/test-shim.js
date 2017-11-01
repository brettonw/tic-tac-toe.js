"use strict";

//-----------------------------------------------------------------------------
// helper objects that echo typical Javascript in a browser
//-----------------------------------------------------------------------------
let console = {
    log : function (text) {
        print (text);
    }
};

//-----------------------------------------------------------------------------
// Array.fill - because jjs doesn't seem to have it
if (typeof (Array.prototype.fill) === "undefined") {
	Array.prototype.fill = function (value, start, end) {
		if (typeof (end) === "undefined") {
			end = this.length;
			if (typeof (start) === "undefined") {
				start = 0;
			}
		}
		for (let i = start; i < end; ++i) {
			this[i] = value;
		}
		return this;
	}
}

//-----------------------------------------------------------------------------
