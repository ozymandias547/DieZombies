fs = require("fs");
project = require("./ProjectLibrary");

var settings = {};
var classNameDuplicateCheck = {};
var errors = [];

var endsWith = function(str, value) {
	return str.indexOf(value) == str.length - value.length;
}

var fileCompareFunction = function(a, b) {
	if (a.fullPath > b.fullPath)
		return 1;
	if (a.FullPath < b.fullPath)
		return -1;

	return 0;
};

var getJSCodeInformation = function(path) {
	if (path.charAt(0) == "/") {
		path = path.substr(1);
	}

	if (endsWith(path, ".js")) {
		path = path.substr(0, path.length - 3);
	}

	var split = path.split("/");

	var className = split[split.length - 1];

	var packageName = "";

	for (var i = 0; i < split.length - 1; i++) {
		packageName += split[i];
	}

	if (classNameDuplicateCheck[className] != null) {
		errors.push({
			message: "Duplicate class found: '" + className + "'.\n    at '" + packageName + "'\n    at '" + classNameDuplicateCheck[className] + "'\nClass names must be unique."
		});
	}

	classNameDuplicateCheck[className] = packageName;
	return {
		packageName: packageName,
		className: className,
		publicPath: settings.jsOutputPrefix + "/" + path
	};
};

var isClassFileFilter = {
	filter: function(name, fullPath, stat) {
		if (name.charAt(0) == name.charAt(0).toUpperCase() && endsWith(name, ".js")) {
			return {
				name: name,
				fullPath: fullPath,
				size: stat.size,
				js: getJSCodeInformation(fullPath.substr(settings.javascriptRootDirFull.length))
			};
		}

		return null;
	}
}

project.readProject(function (projectSettings) {
	settings = projectSettings;

	settings.javascriptRootDirFull = fs.realpathSync(".") + settings.javascriptRootDir;

	find(settings.javascriptRootDirFull, function(found) {
		found.sort(fileCompareFunction);

		process.stdout.write(JSON.stringify({
			classes: found,
			errors: errors
		}, null, 4));
	}, isClassFileFilter);
});

var find = function(dir, callback, filter, recurse, found, waiter) {
	waiter = waiter ? waiter : {
		waitCount: 0
	};

	found = found ? found : [];
	recurse = recurse == null ? true : recurse;

	waiter.waitCount++;

	fs.readdir(dir, function(err, files) {
		if (err) {
			console.log(err);
			return;
		}

		var filteredFiles = [];

		for (var i = 0; i < files.length; i++) {
			var filename = dir + "/" + files[i];
			var stat = fs.statSync(filename);

			var findToken = null;

			if (stat.isDirectory()) {
				find(filename, callback, filter, recurse, found, waiter);
			} else if (!filter || (findToken = filter.filter(files[i], filename, stat)) != null) {
				found.push(findToken);
			}
		}

		waiter.waitCount--;

		if (waiter.waitCount == 0) {
			callback(found);
		}
	});
};