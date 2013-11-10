define(['fitViewportToRatio', 'vec2', 'tileMap', 'Entity', 'CircleEntity', 'PlayerEntity'],
	function(fitViewportToRatio, Vec2, TileMap, Entity, CircleEntity, PlayerEntity) {

		var canvas = null,
			worldObjects = {},
			mouseX, mouseY, isMouseDown,
			lastTime = 0,
			tileMap = new TileMap(15, 15, 60, 60);

		/* ---- INITIALZING ----------------------------- */

		function init(canvasID) {

			initCanvas(canvasID);
			initAnimationFrame();
			bindInput();
			buildFixtureData({
				"player1": {
					role: "player",
					x: canvas.width / 2,
					y: canvas.height / 2,
					radius: 20,
					color: "green"
				},
				"circle": {
					role: "circle",
					x: 100,
					y: 100,
					radius: 30,
					color: "red"
				}
			});

		}

		function buildFixtureData(obj) {
			for (var id in obj) {
				
				if (obj[id].role == "player") 
					worldObjects[id] = PlayerEntity(obj[id].x, obj[id].y,"red", obj[id].radius)

				if (obj[id].role == "circle") 
					worldObjects[id] = CircleEntity(obj[id].x, obj[id].y,"red", obj[id].radius)

			}
		}

		function initCanvas(canvasID) {
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

		function initAnimationFrame() {
			window.requestAnimFrame = (function() {
				return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function( /* function */ callback, /* DOMElement */ element) {
						window.setTimeout(callback, 1000 / 60);
				};
			})();
		}

		function bindInput() {
			document.addEventListener("mousedown", function(e) {
				isMouseDown = true;
				handleMouseMove(e);
				document.addEventListener("mousemove", handleMouseMove, true);
			}, true);

			document.addEventListener("mouseup", function() {
				document.removeEventListener("mousemove", handleMouseMove, true);
				isMouseDown = false;
				mouseX = undefined;
				mouseY = undefined;
			}, true);

			function handleMouseMove(e) {
				var position = $("#canvas").position();
				mouseX = (((e.clientX - canvas.getBoundingClientRect().left) - position.left)) / fitViewportToRatio.getScalar();
				mouseY = (((e.clientY - canvas.getBoundingClientRect().top) - position.top)) / fitViewportToRatio.getScalar();
			};
		}



		/* ---- GAME LOOP ----------------------------- */

		function start() {
			(function loop(animStart) {
				this.context.clearRect(0, 0, canvas.width, canvas.height);

				var elapsed = lastTime ? (new Date().getTime() - lastTime) / 1000.0 : 0.0;

				update(elapsed);
				draw(elapsed);

				lastTime = new Date().getTime();

				requestAnimFrame(loop);
			})();
		}



		function update(elapsed) {
			//get data from server here?

			for (var id in worldObjects) {
				worldObjects[id].update(elapsed);
			}
		}

		function draw(elapsed) {
			tileMap.draw(elapsed, this.context);

			for (var id in worldObjects) {
				worldObjects[id].draw(elapsed, this.context);
			}
		}

		/* ---- EXPOSING API ----------------------------- */

		return {
			init: init,
			start: start
		}

	})