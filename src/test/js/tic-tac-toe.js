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

//-----------------------------------------------------------------------------
