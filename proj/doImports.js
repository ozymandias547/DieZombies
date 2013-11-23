fs = require("fs");

var stdin = process.openStdin();
var data = "";
var dataLoaded = false;
var projectFileLoaded = false;
var classInfos = null;

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

var findReverse = function(str, index, char)
{
	index--;

	while (index > 0 && str.charAt(index) != char) {
		index--;
	}

	return index;
};

var replaceMidWith = function(str, startIX, endIX, contents)
{
	var ret = str.substr(0, startIX);
	ret += contents;
	ret += str.substr(endIX, str.length);

	return ret;
};

var finalize = function() {
	if (!dataLoaded || !projectFileLoaded) {
		return;
	}

	// We loop through every file...
	for (var i = 0; i < classInfos.length; i++)
	{
		// We load the contents of the file...
		var contents = "" + fs.readFileSync(classInfos[i].fullPath);

		// We loop through every import and see if it exists in the file...
		for (var j = 0; j < classInfos.length; j++)
		{
			// We look for the text 'ClassName"' which indicates someone has typed
			// out the classname followed by a quotation mark. In that case we want
			// to inject the full path, making sure it is resolved properly.
			var quotes = ["\"", "'"];

			for (var q = 0; q < quotes.length; q++)
			{
				var ix = contents.toUpperCase().indexOf(classInfos[j].js.className.toUpperCase() + quotes[q]);

				if (ix != -1)
				{
					// Now we iterate backwards until we find the starting quotation mark.
					var startIX = findReverse(contents, ix, quotes[q]) + 1;
					var endIX = ix + classInfos[j].js.className.length;

					contents = replaceMidWith(contents, startIX, endIX, classInfos[j].js.packageName + "." + classInfos[j].js.className);

					fs.writeFileSync(classInfos[i].fullPath, contents);
				}
			}
		}
	}
};