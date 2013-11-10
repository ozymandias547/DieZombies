define(['fitViewportToRatio', 'vec2', 'tileMap', 'isometric'],
	function(fitViewportToRatio, Vec2, TileMap, Isometric) {

		var canvas = null,
			worldObjects = {},
			mouseX, mouseY, isMouseDown,
			lastTime = 0,
			tileMap = new TileMap(15, 15, 60, 60);

		var player = {
				role: "player",
				x: 100,
				y: 100,
				radius: 20,
				color: "green"
			};

		/* ---- INITIALZING ----------------------------- */

		function init(canvasID) {
			initCanvas(canvasID);
			initAnimationFrame();
			bindInput();
			buildFixtureData({
				"player": player,
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
				worldObjects[id] = this[id] = Entity.build(id, obj[id]);
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
			groundFriction: 0.92
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
			draw: function(elapsedTime, context) {
				context.fillStyle = this.color;
				context.beginPath();
				context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
				context.closePath();
				context.fill();
			},
			update: function(elapsed) {

			}
		}

		// CircleEntity.prototype = new Entity();
		// CircleEntity.prototype.constructor = CircleEntity; 

		var PlayerEntity = function(x, y, color, radius) {
			Entity.call(this, x, y, color);
			this.radius = radius;
			this.moveStep = .5;
			this.maxSpeed = 2;
			this.isReady = false;
			this.currentSprite = 0;
			this.spriteFrequency = 200; //in milliseconds
			this.elapsedTime = 0;
			this.lastTime = new Date();

			this.upPressed = false,
			this.downPressed = false,
			this.rightPressed = false,
			this.leftPressed = false;
			this.previousPressed = "right";

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

			draw: function(context) {

				if (this.isMoving()) {
					var currentTime = new Date();
					this.elapsedTime = currentTime - this.lastTime + this.elapsedTime;

					if (this.elapsedTime > this.spriteFrequency) {
						this.elapsedTime = this.elapsedTime - this.spriteFrequency;
						this.currentSprite++
						if (this.currentSprite > 2) this.currentSprite = 0;
					}

					this.lastTime = new Date();
				} else {
					this.currentSprite = 1;
				}

				var _x = Isometric.pX(this.position.x, this.position.y);
				var _y = Isometric.pY(this.position.x, this.position.y, 0);

				if (this.isReady) {
					switch (this.previousPressed) {
						case "up":
							this.runningUp.draw(this.currentSprite, _x, _y);
							break;
						case "right":
							this.runningRight.draw(this.currentSprite, _x, _y);
							break;
						case "down":
							this.runningDown.draw(this.currentSprite, _x, _y);
							break;
						case "left":
							this.runningLeft.draw(this.currentSprite, _x, _y);
							break;
					}
				}
			},

			isMoving: function() {

				if (this.velocity.x > .2) return true;
				if (this.velocity.x < -.2) return true;
				if (this.velocity.y < -.2) return true;
				if (this.velocity.y > .2) return true;

				return false;

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

				switch (e.which) {
					case 87:
						this.upPressed = true;
						this.previousPressed = "up"
						break;
					case 83:
						this.downPressed = true;
						this.previousPressed = "down"
						break;
					case 68:
						this.rightPressed = true;
						this.previousPressed = "right"
						break;
					case 65:
						this.leftPressed = true;
						this.previousPressed = "left"
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

		// PlayerEntity.prototype = new Entity();
		// PlayerEntity.prototype.constructor = PlayerEntity;

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
			Isometric.view(this.player.position.x, this.player.position.y, 1.0, 0.5, 1.0, canvas.width, canvas.height);

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