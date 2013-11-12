define(function() {
	var AbstractState = function(name) {
		this.name = name;
	};

	AbstractState.prototype = {
		enter: function() {console.log("Entering " + this.name)},
		exit: function() {console.log("Exiting " + this.name)}
	};

	return AbstractState;
});