// This will allow us to write our output to a pipe and not die until the other end process all of our output.
process.on("SIGPIPE", process.exit);

var ProjectLibrary = function() {
	
};

ProjectLibrary.prototype = {
	readProject: function(callback) {
		fs.readFile('./project.json', function(err, data) {
			if (err) throw err;

			this.project = JSON.parse(data);

			callback(this.project);
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
	}
};

module.exports = new ProjectLibrary();