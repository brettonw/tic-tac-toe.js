"use strict";

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
        return Player.values[this.value ^ 0x03];
    };

    return _;
} ();

// 8 transformations represent 4 rotations, and a flip on the x-axis with 4 rotations
let Transformation = function () {
	let _ = Enum.create (["R0", "R1", "R2", "R3", "F0", "F1", "F2", "F3"]);
	
    _.inverse = function () {
		switch (this) {
			case Transformation.R1: return Transformation.R3;
			case Transformation.R3: return Transformation.R1;
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
		return this.values[(y * Board.DIMENSION) + x];
	};
	
    _.x = function () {
		return this.value % Board.DIMENSION;
    };

    _.y = function () {
		return Math.floor (this.value / Board.DIMENSION);
    };

    return _;
} ();

let Board = function () {
    let _ = Object.create (null);
	
	// some core values
    Object.defineProperty (_, "DIMENSION", { value: 3 });
    Object.defineProperty (_, "SIZE", { value: _.DIMENSION * _.DIMENSION });

	// return a new empty board
    _.empty = function () {
		let result = Object.create (Board);
		result.board = Array (Board.SIZE).fill (Player.E);
		return result;
    };

	// return a new board from an array
    _.fromArray = function (source) {
		let result = Object.create (Board);
		result.board = source.slice ();
		return result;
    };
	
	// return a new board from a string
    _.fromString = function (string) {
		let result = Object.create (Board);
		result.board = [];
		for (let character of string) {
			result.board.push (Player[character]);
		}
		return result;
    };
	
	// return a new board as a copy of the source
    _.copy = function (source) {
		let result = Object.create (Board);
		result.board = source.board.slice ();
		return result;
    };
	
	// transformations - these look magic, but they are the indices of the 
	//                   values to take into the new array for each of these
	//					 individual transformations.
	const TRANSFORMATIONS = [
		/* Transformation.R0 */ [0, 1, 2, 3, 4, 5, 6, 7, 8],
		/* Transformation.R1 */ [6, 3, 0, 7, 4, 1, 8, 5, 2],
		/* Transformation.R2 */ [8, 7, 6, 5, 4, 3, 2, 1, 0],
		/* Transformation.R3 */ [2, 5, 8, 1, 4, 7, 0, 3, 6],
		/* Transformation.F0 */ [2, 1, 0, 5, 4, 3, 8, 7, 6],
		/* Transformation.F1 */ [8, 5, 2, 7, 4, 1, 6, 3, 0],
		/* Transformation.F2 */ [6, 7, 8, 3, 4, 5, 0, 1, 2],
		/* Transformation.F3 */ [0, 3, 6, 1, 4, 7, 2, 5, 8]
	];
	
	// return a new board that is a transformation of this one
	_.transform = function (transformation) {
		let result = Object.create (Board);
		let from = this.board;
		result.board = [];
		TRANSFORMATIONS[transformation.value].forEach (function (index) {
			result.board.push (from[index]);
		})
		return result;
	};
	
	// make a move on this board, note that the referee ensures moves are legal
	// so the Board class itself doesn't need to do that
	_.makeMove = function (move, player) {
		this.board[move.value] = player;
		return this;
	};
	
	// return the player that occupies the given move
	_.getPlayer = function (move) {
		return this.board[move.value];
	};
	
	// return a string representation of the board
	_.toString = function () {
		let string = "";
		for (let player of this.board) {
			string += player.name;
		}
		return string;
	};
	
	_.equal = function (left, right) {
		return left.toString () === right.toString ();
	};

    return _;
} ();

let Referee = function () {
	let _ = Object.create (null);
	
	const WINS = [
		"XXXEEEEEEX",
		"EEEXXXEEEX",
		"EEEEEEXXXX",
		"XEEXEEXEEX",
		"EXEEXEEXEX",
		"EEXEEXEEXX",
		"XEEEXEEEXX",
		"EEXEXEXEEX",
		"OOOEEEEEEO",
		"EEEOOOEEEO",
		"EEEEEEOOOO",
		"OEEOEEOEEO",
		"EOEEOEEOEO",
		"EEOEEOEEOO",
		"OEEEOEEEOO",
		"EEOEOEOEEO"
	];
	
	_.getWins = function () {
		return WINS;
	};
	
	// loop over all of the open spaces on the board to determine allowed moves
	_.getAvailableMoves = function (board) {
		// get the underlying representation
		board = board.board;
		let moves = [];
		for (let move of Move.values) {
			if (board[move.value] === Player.E) {
				moves.push (move);
			}
		}
		return (moves.length) > 0 ? moves : null;
	};
	
	// this is aslightly clever way to loop over all of the winning board 
	// configurations to see if any given board matches one of them
	_.checkWinner = function (board) {
		// get the underlying representation
		board = board.board;
		
		for (let win of WINS) {
			let maskedSum = 0;
			// add the number of matching spaces together as the player value - 
			// then divide that by three to get which player they match. If that
			// result matches the win configuration of the board, then it is a 
			// win for that player
			for (let i = 0; i < Board.SIZE; ++i) {
				maskedSum += board[i].value & Player[win[i]].value;
			}
			if (Player.values[Math.floor (maskedSum / 3)].name == win[Board.SIZE]) {
				return win[Board.SIZE];
			}
		}
		
		// nobody matched - it's an E...
		return Player.E;
	};
	
    return _;
} ();