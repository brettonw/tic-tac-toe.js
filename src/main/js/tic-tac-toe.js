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


let Enum = function () {
    let _ = Object.create (null);
    _.create = function (names) {
        let createdEnum = Object.create (null);

        // function to create an enumerated object
        let make = function (name, value) {
            //console.log ("enumerate '" + name + "' = " + value);
            let enumeratedValue = Object.create (createdEnum);
            Object.defineProperty(enumeratedValue, "name", { value: name });
            Object.defineProperty(enumeratedValue, "value", { value: value });
            return enumeratedValue;
        };

        // create the enumerated values, which are Objects of this type already populated
        let enumeratedValues = [];
        for (let name of names) {
            let enumeratedValue = make (name, enumeratedValues.length);
            enumeratedValues.push(enumeratedValue);
            Object.defineProperty (createdEnum, name, { value: enumeratedValue, enumerable: true });
        }

        // save the names and values independently
        Object.defineProperty (createdEnum, "names", { value: names });
        Object.defineProperty (createdEnum, "values", { value: enumeratedValues });

        return createdEnum;
    };
    return _;
} ();

let Player = function () {
    let _ = Enum.create (["E", "X", "O"]);

    _.next = function () {
        return _.values[this.value ^ 0x03];
    };

    return _;
} ();

// 8 transformations represent 4 rotations, and a flip on the x-axis with 4 rotations
let Transformation = function () {
	let _ = Enum.create (["R0", "R1", "R2", "R3", "F0", "F1", "F2", "F3"]);
	
    _.inverse = function () {
		switch (this) {
			case _.R1: return _.R3;
			case _.R3: return _.R1;
			default: return this;
		}
    };

    return _;
} ();

let Move = function () {
	let _ = Enum.create ([
		"M00", "M10", "M20",
		"M01", "M11", "M21",
		"M02", "M12", "M22"
	]);
	
	_.get = function (x, y) {
		// XXX should check that the move is legal
		return _.values[(y * Board.DIMENSION) + x];
	};
	
    _.x = function () {
		return this.value % Board.DIMENSION;
    };

    _.y = function () {
		return Math.floor (this.value / Board.DIMENSION);
    };

    return _;
} ();

// Board is an abstraction on a string-based representation of a tic-tac-toe board
let Board = function () {
    let _ = Object.create (Base);

	// some core values
    Object.defineProperty(_, "DIMENSION", { value: 3 });
    Object.defineProperty(_, "SIZE", { value: _.DIMENSION * _.DIMENSION });

	// transormations
	
    _.init = function (parameters) {

    };

    return _;
} ();
