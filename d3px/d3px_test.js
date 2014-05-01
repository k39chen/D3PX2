steal(
	'funcunit',
	function (S) {

	// this tests the assembly 
	module("d3px", {
		setup : function () {
			S.open("//d3px/index.html");
		}
	});

	test("welcome test", function () {
		equals(S("h1").text(), "Welcome to JavaScriptMVC!", "welcome text");
	});

});
