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
        const MASK = 3;
        return _.values[this.value ^ MASK];
    };

    return _;
} ();

// Board is an abstraction on a string-based representation of a tic-tac-toe board
let Board = function () {
    let _ = Object.create (Base);

    Object.defineProperty(_, "DIMENSION", { value: 3 });
    Object.defineProperty(_, "SIZE", { value: _.DIMENSION * _.DIMENSION });

    _.init = function (parameters) {

    };

    return _;
} ();
