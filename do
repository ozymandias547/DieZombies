project = require("./modules/JSProject");

var instructions = {
	scan: {
		desc: "Dumps a JSON of all the project scanned info to the standard out.",
		run: function() {
			project.scan(function (results) {
				console.log(results);
			});
		}
	},
	imports: {
		desc: "Runs through all the javascript class files and cleans up the imports.",
		run: function() {

		}
	},
	require: {
		desc: "Rebuilds your project.json:requireMain.js file to match all the JS classes in your project.",
		run: function() {

		}
	}
};

if (process.argv.length == 2) {
	var thr = "ERROR: Must provide at least one instruction: node proj/do.js <instruction>\n\n";

	for (var instruction in instructions) {
		thr += " * " + instruction + ": " + instructions[instruction].desc + "\n";
	}

	console.log(thr);

	return;
}

instructions[process.argv[2]].run();