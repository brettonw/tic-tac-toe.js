"use strict;" 

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
// test functions built on the harness
//-----------------------------------------------------------------------------
let testEnum = function () {
    console.log ("testEnum");
    let e = Enum.create (["A", "B", "C"]);
    Test.assertTrue("A.name", e.A.name == "A");
    Test.assertTrue("A.value", e.A.value == 0);

    Test.assertTrue("A.names indexed", e[e.names[0]] == e.A);
    Test.assertTrue("A.names", e.names[0] == e.A.name);
    Test.assertTrue("A.values", e.values[0] == e.A);

    Test.assertTrue("B.name", e.B.name == "B");
    Test.assertTrue("B.value", e.B.value == 1);

    Test.assertTrue("B.names indexed", e[e.names[1]] == e.B);
    Test.assertTrue("B.names", e.names[1] == e.B.name);
    Test.assertTrue("B.values", e.values[1] == e.B);

    Test.assertTrue("C.name", e.C.name == "C");
    Test.assertTrue("C.value", e.C.value == 2);

    Test.assertTrue("C.names indexed", e[e.names[2]] == e.C);
    Test.assertTrue("C.names", e.names[2] == e.C.name);
    Test.assertTrue("C.value", e.values[2] == e.C);
	
	Test.assertTrue ("A.toString ()", e.A.toString () === e.A.name);
	Test.assertTrue ("B.toString ()", e.B.toString () === e.B.name);
	Test.assertTrue ("C.toString ()", e.C.toString () === e.C.name);
	
	Test.assertTrue ("A - implicit conversion [" + e.A + "]", ("e.A = (" + e.A + ")") == "e.A = (A)");
	Test.assertTrue ("B - implicit conversion [" + e.B + "]", ("e.B = (" + e.B + ")") == "e.B = (B)");
	Test.assertTrue ("C - implicit conversion [" + e.C + "]", ("e.C = (" + e.C + ")") == "e.C = (C)");
	
	// test iteration over 'e'
	let compare = { A: "A", B: "B", C: "C"};
	for (let memberName in e) {
		Test.assertTrue (memberName + " is expected", compare[memberName] == memberName);
		Test.assertTrue (memberName + " is implictly converted", compare[memberName] == e[memberName]);
		Test.assertTrue (memberName + " is an object", compare[memberName] !== e[memberName]);
	}
} ();

let testPlayer = function () {
    console.log ("testPlayer");

    Test.assertTrue("Player.E", Player.E.value == 0);
    Test.assertTrue("Player.X", Player.X.value == 1);
    Test.assertTrue("Player.O", Player.O.value == 2);

    Test.assertTrue("player.E.name", Player.E.name == "E");
    Test.assertTrue("player.X.name", Player.X.name == "X");
    Test.assertTrue("player.O.name", Player.O.name == "O");

    Test.assertTrue("player.next (X -> O)", Player.X.next () === Player.O);
    Test.assertTrue("player.next (O -> X)", Player.O.next () === Player.X);
} ();

let testTransformation = function () {
    console.log ("testTransformation");
	Test.assertTrue ("R0.inverse == t", Transformation.R0.inverse () === Transformation.R0);
	Test.assertTrue ("R2.inverse == t", Transformation.R2.inverse () === Transformation.R2);
	Test.assertTrue ("F0.inverse == t", Transformation.F0.inverse () === Transformation.F0);
	Test.assertTrue ("F1.inverse == t", Transformation.F1.inverse () === Transformation.F1);
	Test.assertTrue ("F2.inverse == t", Transformation.F2.inverse () === Transformation.F2);
	Test.assertTrue ("F3.inverse == t", Transformation.F3.inverse () === Transformation.F3);
	Test.assertTrue ("R1.inverse == R3", Transformation.R1.inverse () === Transformation.R3);
	Test.assertTrue ("R3.inverse == R1", Transformation.R3.inverse () === Transformation.R1);
} ();

let testMove = function () {
    console.log ("testMove");
    Test.assertTrue("M00 = (0, 0)", (Move.M00.x () == 0) && (Move.M00.y () == 0));
    Test.assertTrue("M01 = (0, 1)", (Move.M01.x () == 0) && (Move.M01.y () == 1));
    Test.assertTrue("M02 = (0, 2)", (Move.M02.x () == 0) && (Move.M02.y () == 2));

    Test.assertTrue("M10 = (1, 0)", (Move.M10.x () == 1) && (Move.M10.y () == 0));
    Test.assertTrue("M11 = (1, 1)", (Move.M11.x () == 1) && (Move.M11.y () == 1));
    Test.assertTrue("M12 = (1, 2)", (Move.M12.x () == 1) && (Move.M12.y () == 2));

    Test.assertTrue("M20 = (2, 0)", (Move.M20.x () == 2) && (Move.M20.y () == 0));
    Test.assertTrue("M21 = (2, 1)", (Move.M21.x () == 2) && (Move.M21.y () == 1));
    Test.assertTrue("M22 = (2, 2)", (Move.M22.x () == 2) && (Move.M22.y () == 2));

	Test.assertTrue("(0, 0) = M00", Move.get (0, 0) == Move.M00);
	Test.assertTrue("(0, 1) = M01", Move.get (0, 1) == Move.M01);
	Test.assertTrue("(0, 2) = M02", Move.get (0, 2) == Move.M02);

	Test.assertTrue("(1, 0) = M10", Move.get (1, 0) == Move.M10);
	Test.assertTrue("(1, 1) = M11", Move.get (1, 1) == Move.M11);
	Test.assertTrue("(1, 2) = M12", Move.get (1, 2) == Move.M12);

	Test.assertTrue("(2, 0) = M20", Move.get (2, 0) == Move.M20);
	Test.assertTrue("(2, 1) = M21", Move.get (2, 1) == Move.M21);
	Test.assertTrue("(2, 2) = M22", Move.get (2, 2) == Move.M22);
} ();

let testBoard = function () {
    console.log ("testBoard");
	//console.log ("Empty: " + Board.empty ().toString ());
	Test.assertTrue ("empty === 'EEEEEEEEE'", Board.empty ().toString () === "EEEEEEEEE");
	Test.assertTrue ("empty === empty", Board.equal (Board.empty (), Board.empty ()));
	Test.assertTrue ("getPlayer (0, 0) == empty", Board.empty ().getPlayer (Move.M00) == Player.E);
	Test.assertTrue ("makeMove", Board.empty ().makeMove (Move.M10, Player.X).toString () === "EXEEEEEEE");
} ();

let testBoardTransforms = function () {
    console.log ("testBoardTransforms");
	let plays = "XXXEOEOEE";
	let board = Board.fromString (plays);
	let should;
	for (let transformation of Transformation.values) {
		switch (transformation) {
			case Transformation.R0: should = "XXXEOEOEE"; break;
			case Transformation.R1: should = "OEXEOXEEX"; break;
			case Transformation.R2: should = "EEOEOEXXX"; break;
			case Transformation.R3: should = "XEEXOEXEO"; break;
			case Transformation.F0: should = "XXXEOEEEO"; break;
			case Transformation.F1: should = "EEXEOXOEX"; break;
			case Transformation.F2: should = "OEEEOEXXX"; break;
			case Transformation.F3: should = "XEOXOEXEE"; break;
		}
		let testBoard = board.transform (transformation);
		let str = transformation.name;
		Test.assertTrue (str + " == should", testBoard.toString () === should);
		testBoard = testBoard.transform (transformation.inverse ());
		Test.assertTrue (str + " (invert) == original", testBoard.toString () === plays);
	}
} ();

let testRefereeLegalMoves = function () {
	console.log ("testRefereeLegalMoves");
	let board = Board.empty ();
	let moves = Referee.getAvailableMoves (board);
	Test.assertTrue ("Empty board has " + Board.SIZE + " available moves", moves.length == Board.SIZE);
	board.makeMove (Move.M00, Player.X);
	moves = Referee.getAvailableMoves (board);
	Test.assertTrue ("Empty board has " + (Board.SIZE - 1) + " available moves", moves.length == (Board.SIZE - 1));
	for (let move of moves) {
		Test.assertFalse (Move.M00.name + " is not in available moves", Move.M00 == move);
	}
} ();

let testRefereeWins = function () {
	console.log ("testRefereeWins");
	let wins = Referee.getWins ();
	for (let win of wins) {
		let board = Board.fromString (win);
		//console.log ("board: " + board.toString ());
		Test.assertTrue ("Test board (" + board.toString () + ") should win", Referee.checkWinner (board) == win[Board.SIZE]);
	}
} ();

let testRefereeNonWins = function () {
	console.log ("testRefereeNonWins");
	let nonWins = [
		"EEEEEEEEE",
		"EEXEEEEEE",
		"EEXOEEEEE",
		"EEXOXEEEE",
		"EEXOXOEEE"
	];
	for (let nonWin of nonWins) {
		let board = Board.fromString (nonWin);
		Test.assertTrue ("Test board (" + board.toString () + ") should not win", Referee.checkWinner (board) == Player.E);
	}
} ();

//-----------------------------------------------------------------------------
