fs = require("fs");

module.exports = {
	run: function(project) {
		fs.readFile("." + project.settings.requireMain, function(err, data) {
			if (err) throw err;

			var requireOutputFilePrev = "" + data;

			var requireOutputFile = null;
			var replaceIndexStart = requireOutputFilePrev.indexOf(project.settings.outputStartToken) + project.settings.outputStartToken.length;
			var replaceIndexEnd = requireOutputFilePrev.indexOf(project.settings.outputEndToken);

			if (replaceIndexStart == -1 || replaceIndexEnd == -1) {
				throw "Could not find the start or end token in the file: '" + project.settings.outputStartToken + "' or '" + project.settings.outputEndToken + "'";
			}

			var prefix = getFormatPrefixAtPoint(requireOutputFilePrev, requireOutputFilePrev.indexOf(project.settings.outputStartToken));

			requireOutputFile = requireOutputFilePrev.substr(0, replaceIndexStart) + "\n";

			for (var i = 0; i < classInfos.length; i++) {
				var ci = classInfos[i];

				requireOutputFile += prefix + "\"" + ci.js.packageName + "." + ci.js.className + "\": \"" + ci.js.className + "\",\n";
			}

			requireOutputFile = requireOutputFile.substr(0, requireOutputFile.length - 2) + "\n";

			requireOutputFile += prefix + requireOutputFilePrev.substr(replaceIndexEnd, requireOutputFilePrev.length);

			fs.writeFile("./gen" + project.settings.requireMain, requireOutputFile, function(err) {
				if (err) throw err;
				console.log(project.settings.requireMain + " has been successfully overwritten.");
			});
		});
	}
};