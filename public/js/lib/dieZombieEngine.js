define(['fitViewportToRatio', 'vec2'],
	function(fitViewportToRatio, Vec2) {

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

		var physics = {
			gravity: new Vec2(0, 0), //unrealistic, but hey it's a game!
			groundFriction: .9
		}

		/* ---- ENTITIES ----------------------------- */

		var Entity = function(x, y, color) {
			color = color || "red";

			this.position = new Vec2(x, y);
			this.velocity = new Vec2(0, 0);
			this.acceleration = 0;

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
			this.moveStep = 1;
			this.maxSpeed = 3;
			this.isReady = false;
			this.currentSprite = 0;

			this.upPressed = false,
			this.downPressed = false,
			this.rightPressed = false,
			this.leftPressed = false;

			this.image = new Image();
			this.image.src = "assets/OrcExample.png";
			this.image.onload = function() {
				this.isReady = true;
				this.runningDown = new Sprite(this.image, 40, 40, [
					[0, 0],
					[40, 0],
					[80, 0]
				]);
				this.runningRight = new Sprite(this.image, 40, 40, [
					[0, 40],
					[40, 40],
					[80, 40]
				]);
				this.runningUp = new Sprite(this.image, 40, 40, [
					[0, 80],
					[40, 80],
					[80, 80]
				]);
				this.runningLeft = new Sprite(this.image, 40, 40, [
					[0, 120],
					[40, 120],
					[80, 120]
				]);
			}.bind(this);

			document.addEventListener("keydown", this.handleKeyDown.bind(this))
			document.addEventListener("keyup", this.handleKeyUp.bind(this))


		}

		PlayerEntity.prototype = {

			draw: function() {
				if (this.isReady) {
					var directionRunning = this.whichDirection();
					switch (directionRunning) {
						case "up":
							this.runningUp.draw(0, this.position.x, this.position.y);
							break;
						case "right":
							this.runningRight.draw(0, this.position.x, this.position.y);
							break;
						case "down":
							this.runningDown.draw(0, this.position.x, this.position.y);
							break;
						case "left":
							this.runningLeft.draw(0, this.position.x, this.position.y);
							break;
					}
				}
			},
			whichDirection : function() {

			},
			update: function() {
				this.handleControls()
				this.velocity.sMultiplyEq(physics.groundFriction)
				this.velocity.sRestrictEq(this.maxSpeed);
				this.position.vPlusEq(this.velocity)
			},

			handleControls: function() {

				if (this.upPressed) {
					this.velocity.y -= this.moveStep;
				}
				if (this.downPressed) {
					this.velocity.y += this.moveStep;
				}
				if (this.rightPressed) {
					this.velocity.x += this.moveStep;
				}
				if (this.leftPressed) {
					this.velocity.x -= this.moveStep;
				}
			},

			handleKeyDown: function(e) {

				console.log(this.upPressed)

				switch (e.which) {
					case 87:
						this.upPressed = true;
						break;
					case 83:
						this.downPressed = true;
						break;
					case 68:
						this.rightPressed = true;
						break;
					case 65:
						this.leftPressed = true;
						break;
				}

			},
			handleKeyUp: function(e) {
				switch (e.which) {
					case 87:
						this.upPressed = false;
						break;
					case 83:
						this.downPressed = false;
						break;
					case 68:
						this.rightPressed = false;
						break;
					case 65:
						this.leftPressed = false;
						break;
				}
			}
		}

		/* ---- SPRITE SHEETS ----------------------------- */

		function Sprite(img, width, height, positions) {
			this.img = img;
			this.width = width;
			this.height = height;
			this.positions = positions;
		}

		Sprite.prototype = {
			draw: function(position, x, y) {
				var pos = this.positions[position];
				context.drawImage(
					this.img,
					pos[0],
					pos[1],
					this.width,
					this.height,
					x,
					y,
					this.width,
					this.height
				);
			}
		};

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