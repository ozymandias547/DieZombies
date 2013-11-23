scanner = require("./JSProjectScanner");

// This will allow us to write our output to a pipe and not die until the other end process all of our output.
process.on("SIGPIPE", process.exit);

var ProjectLibrary = function() {
	this.settings = null;
	this.scanResults = null;
};

ProjectLibrary.prototype = {
	readSettings: function(callback) {
		if (this.settings) {
			callback(this.settings);
		}

		var self = this;

		fs.readFile('./project.json', function(err, data) {
			if (err) throw err;

			self.settings = JSON.parse(data);

			console.log("SETTINGS BABY");
			console.log(self.settings);

			self.settings.javascriptRootDirFull = fs.realpathSync(".") + self.settings.javascriptRootDir;

			callback(self.settings);
		});
	},
	readStdIn: function(callback) {
		this.stdin = process.openStdin();
		this.stdinData = "";

		stdin.on('data', function(chunk) {
			this.stdinData += chunk;
		});

		stdin.on('end', function() {
			callback(this.stdinData);
		});
	},
	scan: function(callback) {
		if (this.scanResults) {
			callback(this.scanResults);
		}

		scanner.scan(function(results) {
			this.scanResults = results;
			callback(results);
		});
	},
	readProjectAndScan: function(callback) {
		readProject(function(project) {
			scan(function(results) {
				callback();
			});
		});
	}

};

module.exports = new ProjectLibrary();