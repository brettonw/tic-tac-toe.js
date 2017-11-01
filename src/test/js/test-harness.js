"use strict";

//-----------------------------------------------------------------------------
let Test = {
    assertTrue : function (message, test) {
        console.log (((test === true) ? "PASS" : "FAIL") + " - " + message);
        if (test === false) {
			if (typeof (exit) !== "undefined") {
				exit (1);
			}
        }
    },
    assertFalse : function (message, test) {
		Test.assertTrue (message, test === false);
    }
};

//-----------------------------------------------------------------------------
