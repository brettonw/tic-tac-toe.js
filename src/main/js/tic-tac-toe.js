"use strict";

let Player = function () {
    let _ = Enum.create ("E", "X", "O");

    Object.defineProperty(_, "next", { get: function() {
    	return Player.values[this.value ^ 0x03];
    } });
    /*
    _.next = function () {
        return Player.values[this.value ^ 0x03];
    };
    */

    return _;
} ();

// 8 transformations represent 4 rotations, and a flip on the x-axis with 4 rotations
let Transformation = function () {
	let _ = Enum.create (
		"R0", "R1", "R2", "R3", 
		"F0", "F1", "F2", "F3"
	);
	
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
	let _ = Enum.create (
		"M00", "M10", "M20",
		"M01", "M11", "M21",
		"M02", "M12", "M22"
	);
	
	_.get = function (x, y) {
		// XXX should check that the move is legal
		return this.values[(y * Board.DIMENSION) + x];
	};

    Object.defineProperty(_, "x", { get: function() {
    	return this.value % Board.DIMENSION;
    } });
    /*
    _.x = function () {
		return this.value % Board.DIMENSION;
    };
    */

    Object.defineProperty(_, "y", { get: function() {
    	return Math.floor (this.value / Board.DIMENSION);
    } });
    /*
    _.y = function () {
		return Math.floor (this.value / Board.DIMENSION);
    };
    */

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
	const TRANSFORMATIONS = Object.create (null);
	TRANSFORMATIONS[Transformation.R0] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	TRANSFORMATIONS[Transformation.R1] = [6, 3, 0, 7, 4, 1, 8, 5, 2];
	TRANSFORMATIONS[Transformation.R2] = [8, 7, 6, 5, 4, 3, 2, 1, 0];
	TRANSFORMATIONS[Transformation.R3] = [2, 5, 8, 1, 4, 7, 0, 3, 6];
	TRANSFORMATIONS[Transformation.F0] = [2, 1, 0, 5, 4, 3, 8, 7, 6];
	TRANSFORMATIONS[Transformation.F1] = [8, 5, 2, 7, 4, 1, 6, 3, 0];
	TRANSFORMATIONS[Transformation.F2] = [6, 7, 8, 3, 4, 5, 0, 1, 2];
	TRANSFORMATIONS[Transformation.F3] = [0, 3, 6, 1, 4, 7, 2, 5, 8];
	
	// return a new board that is a transformation of this one
	_.transform = function (transformation) {
		let result = Object.create (Board);
		let from = this.board;
		result.board = [];
		TRANSFORMATIONS[transformation].forEach (function (index) {
			result.board.push (from[index]);
		})
		return result;
	};
	
	// return a new board with the requested move made, note that the referee 
	// ensures moves are legal so the Board class itself doesn't need to do that
	_.makeMove = function (move, player) {
		let result = Object.create (Board);
		result.board = this.board.slice ();
		result.board[move.value] = player;
		return result;
	};
	
	// return the player that occupies the given move
	_.getPlayer = function (move) {
		return this.board[move.value];
	};
	
	// return a string representation of the board
	_.toString = function () {
		let string = "";
		for (let player of this.board) {
			string += player;
		}
		return string;
	};
	
	_.equal = function (left, right) {
		return left.toString () === right.toString ();
	};

    return _;
} ();

// referree is a singleton object that knows how to play the game. if you want
// to make a move, you ask the referee what you can do, and you ask the referee
// if you won...
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

    Object.defineProperty(_, "wins", { get: function() {
		return WINS;
	} });
    /*
	_.getWins = function () {
		return WINS;
	};
	*/
	
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
		return moves;
	};
	
	// this is a slightly clever way to loop over all of the winning board 
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
			if (Player.values[Math.floor (maskedSum / 3)] == win[Board.SIZE]) {
				return Player[win[Board.SIZE]];
			}
		}
		
		// nobody matched - it's an E...
		return Player.E;
	};
	
    return _;
} ();

// a representation of the configuration space as an entity, and a collection
let State = function () {
	let _ = Object.create (null);
	
	let archive = Object.create (null);
	
	let makeLink = function (transformation, state) {
		return {
			transformation: transformation,
			to: state
		};
	};
	
	let stateCount = 0;
	_.create = function (board) {
		++stateCount;
		let state = archive[board] = Object.create (_);
		state.board = board;
		state.parentLinks = Object.create (null);
		state.childLinks = Object.create (null);
		state.winner = Player.E;
		return state;
	};
	
	// find a game state that matches the requested board, searching all of the
	// possible transformations - returns it as a link
	_.find = function (board) {
        for (let transformation of Transformation.values) {
            let transformedBoard = board.transform (transformation);
            if (transformedBoard in archive) {
				return makeLink (transformation, archive[transformedBoard]);
            }
        }
        return null;
	};
	
	// this is the worker function that populates the archive of game states
	let linkCount = 0;
	let winCounts = [0, 0, 0];
	let wins = Object.create (null);
	let playAll = function (link, player) {
		let state = link.to;
		
		// iterate over all the available moves
		let board = state.board;
		for (let move of Referee.getAvailableMoves (board)) {
			// make the move, and see if we've already explored this branch
			let newBoard = board.makeMove (move, player);
			let newLink = _.find (newBoard);
			if (newLink == null) {
				// we haven't explored this branch, so create a new state for 
				// it, and make a link with an identity transformation
				let newState = _.create (newBoard);
				newLink = makeLink (Transformation.R0, newState);

				// check to see if the player just won the game
				if (Referee.checkWinner (newBoard) === player) {
					//console.log ("Win for " + player + " on: " + newBoard);
					winCounts[player.value]++;
					wins[newBoard] = newState;
					state.winner = player;
				} else {
					// they didn't, so use recursion to keep playing. note we
					// don't need to worry about this recursion, as it can 
					// never go deeper than the max number of moves (9)
					playAll (makeLink (Transformation.R0, newState), player.next);
				}
			} else {
				// stop populating from here because the branch has already 
				// been played
				// console.log ("Found existing state (" + newLink.state.board + " on transformation " + newLink.transformation + ")");
			}
			
			// update the link, and add it to both states, the child links can
			// never be anything other than valid moves, but the parental links
			// might not be unique on the move due to the transformations - so 
			// we concatenate the transformation with the move
			++linkCount;
			newLink.move = move;
			newLink.from = state;
			state.childLinks[move] = newLink;
			newLink.to.parentLinks[move + "/" + newLink.transformation] = newLink;
		}
	};
	
	// populate the archive
	_.root = _.create (Board.empty ());
	_.init = function () {
		playAll (makeLink (Transformation.R0, State.root), Player.X);
		console.log ("State Count: " + stateCount);
		console.log ("Link Count: " + linkCount);
		console.log ("Wins: " + Object.keys(wins).length + " (X " + winCounts[Player.X.value] + ", O " + winCounts[Player.O.value] + ")");
	}

	return _;
} ();

State.init ();
