define(['jquery', 'vec2', 'fitViewportToRatio'], function() {

	var events = {}

	function bindEvents() {
		document.addEventListener("mousedown", function(e) {
			isMouseDown = true;
			handleMouseClick(e);
			handleMouseMove(e);
			
			document.addEventListener("mousemove", handleMouseMove, true);
		}, true);

		document.addEventListener("mouseup", function() {
			document.removeEventListener("mousemove", handleMouseMove, true);
			isMouseDown = false;
			mouseX = undefined;
			mouseY = undefined;
		}, true);
	}

	function handleMouseMove(e) {
		var position = $("#canvas").position();
		mouseX = (((e.clientX - canvas.getBoundingClientRect().left) - position.left)) / fitViewportToRatio.getScalar();
		mouseY = (((e.clientY - canvas.getBoundingClientRect().top) - position.top)) / fitViewportToRatio.getScalar();
	};


	function handleMouseClick(e) {
		
		var position = $("#canvas").position();
		mouseClickX = (((e.clientX - canvas.getBoundingClientRect().left) - position.left)) / fitViewportToRatio.getScalar();
		mouseClickY = (((e.clientY - canvas.getBoundingClientRect().top) - position.top)) / fitViewportToRatio.getScalar();

		clickPosition = new Vec2(mouseClickX, mouseClickY);

		for (var id in events)
			for (var i = 0; i < events[id].length; i++)
				events[id][i]();
	};


	function addClickEvent(namespace, event) {
		events[namespace].push(event);
	}

	function removeClickEvent(namespace) {
		removeEvents();
	}


	return {
		addClickEvent: addClickEvent,
		removeClickEvent: removeClickEvent
	};
})