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
let Test = {
    assertTrue : function (message, pass) {
        print ((pass ? "PASS" : "FAIL") + " - " + message);
        if (pass === false) {
            exit (1);
        }
    }
};

//-----------------------------------------------------------------------------
