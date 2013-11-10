define(['fitViewportToRatio'],
	function(fitViewportToRatio) {

		var canvas = null,
			worldObjects = {},
			mouseX, mouseY, isMouseDown;



		/* ---- INITIALZING ----------------------------- */

		function init(canvasID) {

			initCanvas(canvasID);
			initAnimationFrame();
			bindInput();
			buildFixtureData({
				"player1": {
					role: "player",
					x: 50,
					y: 50,
					radius: 20,
					color: "green"
				}
			});

		}

		function buildFixtureData(obj) {
			for (var id in obj) {
				worldObjects[id] = Entity.build(id, obj[id]);
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

		/* ---- ENTITIES ----------------------------- */

		var Entity = function(x, y, color) {
			color = color || "red";
			this.x = x;
			this.y = y;
			this.color = color;
		}

		Entity.build = function(id, def) {
			if (def.role == "player")
				return new PlayerEntity(def.x, def.y, def.color, def.radius);
			if (def.role == "circle")
				return new CircleEntity(def.x, def.y, def.color, def.radius)
		}

		var CircleEntity = function(x, y, color, radius) {
			Entity.call(this, x, y, color);
			this.radius = radius;
		}

		CircleEntity.prototype = {
			draw: function() {
				context.fillStyle = this.color;
				context.beginPath();
				context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
				context.closePath();
				context.fill();
			},
			update: function() {

			}
		}

		var PlayerEntity = function(x, y, color, radius) {
			Entity.call(this, x, y, color);
			this.radius = radius;
			
			var upPressed = false,
			 	downPressed = false,
			 	rightPressed = false,
			 	leftPressed = false;


			 //needs to be throttled
			$(document).on("keydown", this.handleKeyDown)
			$(document).on("keyup", this.handleKeyUp)

		}

		PlayerEntity.prototype = {
			draw: function() {
				context.fillStyle = this.color;
				context.beginPath();
				context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
				context.closePath();
				context.fill();
			},
			update: function() {

				this.handleControls() 

			},

			handleControls : function() {
				console.log("hie!")
				if (this.upPressed) {
					console.log("up")
					this.y --;
				}
				if (this.downPressed) {
					console.log("down")
					this.y ++;
				}
				if (this.rightPressed) {
					console.log("right")
					this.x++;
				}
				if (this.leftPressed) {
					console.log("left")
					this.x--;
				}
			},

			handleKeyDown: function(e) {
				
				if (e.which == 87) {
					this.upPressed = true;
				}

				if (e.which == 83) {
					this.downPressed = true;
				}

				if (e.which == 68) {
					this.rightPressed = true;
				}

				if (e.which == 65) {
					this.leftPressed = true;
				}

			},
			handleKeyUp: function(e) {
				
				if (e.which == 87) {
					this.upPressed = false;
				}

				if (e.which == 83) {
					this.downPressed = false;
				}

				if (e.which == 68) {
					this.rightPressed = false;
				}

				if (e.which == 65) {
					this.leftPressed = false;
				}

			}

		}



		/* ---- GAME LOOP ----------------------------- */

		function start() {
			(function loop(animStart) {
				this.context.clearRect(0, 0, canvas.width, canvas.height);

				update();
				draw();

				requestAnimFrame(loop);
			})();
		}

		function update() {
			//get data from server here?

			for (var id in worldObjects)
				worldObjects[id].update();
		}

		function draw() {
			for (var id in worldObjects)
				worldObjects[id].draw();
		}

		/* ---- EXPOSING API ----------------------------- */

		return {
			init: init,
			start: start
		}

	})