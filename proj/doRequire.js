fs = require("fs");

var stdin = process.openStdin();

var data = "";
var dataLoaded = false;
var projectFileLoaded = false;
var classInfos = [];
var requireOutputFilePrev = null;

var getFormatPrefixAtPoint = function(fileContents, index) {
	var prefix = "";
	index--;

	while (index > 0 && fileContents.charAt(index) == " " || fileContents.charAt(index) == "\t") {
		prefix = fileContents.charAt(index) + prefix;
		index--;
	}

	return prefix;
}

stdin.on('data', function(chunk) {
	data += chunk;
});

stdin.on('end', function() {
	classInfos = JSON.parse(data).classes;

	dataLoaded = true;

	finalize();
});

fs.readFile('./project.json', function(err, data) {
	if (err) throw err;

	project = JSON.parse(data);

	fs.readFile("." + project.requireMain, function(err, data) {
		if (err) throw err;

		requireOutputFilePrev = "" + data;

		projectFileLoaded = true;

		finalize();
	});
});

var finalize = function() {
	if (!dataLoaded || !projectFileLoaded) {
		return;
	}

	var requireOutputFile = null;
	var replaceIndexStart = requireOutputFilePrev.indexOf(project.outputStartToken) + project.outputStartToken.length;
	var replaceIndexEnd = requireOutputFilePrev.indexOf(project.outputEndToken);

	if (replaceIndexStart == -1 || replaceIndexEnd == -1) {
		throw "Could not find the start or end token in the file: '" + project.outputStartToken + "' or '" + project.outputEndToken + "'";
	}

	var prefix = getFormatPrefixAtPoint(requireOutputFilePrev, requireOutputFilePrev.indexOf(project.outputStartToken));

	requireOutputFile = requireOutputFilePrev.substr(0, replaceIndexStart) + "\n";

	for (var i = 0; i < classInfos.length; i++) {
		var ci = classInfos[i];

		requireOutputFile += prefix + "\"" + ci.js.packageName + "." + ci.js.className + "\": \"" + ci.js.className + "\",\n";
	}

	requireOutputFile = requireOutputFile.substr(0, requireOutputFile.length - 2) + "\n";

	requireOutputFile += prefix + requireOutputFilePrev.substr(replaceIndexEnd, requireOutputFilePrev.length);

	fs.writeFile("." + project.requireMain, requireOutputFile, function(err) {
		if (err) throw err;
		console.log(project.requireMain + " has been successfully overwritten.");
	});
}