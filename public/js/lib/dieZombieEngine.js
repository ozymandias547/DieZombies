define(function() {

	var canvas = null;

	function init(canvasID) {

		canvas = document.getElementById(canvasID);
		context = canvas.getContext('2d');



		context.beginPath();
		context.rect(0, 0, canvas.width, canvas.height);
		context.fillStyle = 'yellow';
		context.fill();
		context.lineWidth = 7;
		context.strokeStyle = 'black';
		context.stroke();
	}

	return {
		init: init
	}

})
	

