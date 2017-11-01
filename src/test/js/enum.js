"use strict;" 

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

//-----------------------------------------------------------------------------
