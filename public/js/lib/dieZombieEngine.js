define(['fitViewportToRatio', 'vec3', 'tileMap', 'Entity', 'CircleFactory', 'PlayerFactory', 'EnemyFactory', 'isometric'],
	function (fitViewportToRatio, Vec3, TileMap, Entity, CircleFactory, PlayerFactory, EnemyFactory, Isometric)
	{
		var DieZombieEngine = function()
		{
			this.canvas = null;
			this.worldObjects = {};
			this.mouseX = -1;
			this.mouseY = -1;
			this.isMouseDown = false;
			this.lastTime = 0;
			this.tileMap = new TileMap(15, 15, 60, 60);
			this.frameRateElapsed = 0;
			this.frameRate = 0;
			this.frameCount = 0;

			/* ---- INITIALZING ----------------------------- */

			this.init = function (canvasID) {
				this.initCanvas(canvasID);
				this.initAnimationFrame();
				this.bindInput();
				this.buildFixtureData({
					"enemy1": {
						role: "enemy",
						x: 200,
						y: 200,
						radius: 30,
						color: "red"
					},
					"player1": {
						role: "player",
						x: 100,
						y: 100,
						radius: 20,
						color: "green"
					}
				});

			}

			this.buildFixtureData = function(obj) {
				for (var id in obj) {	
					if (obj[id].role == "player") 
						this.worldObjects[id] = this.player = PlayerFactory(obj[id].x, obj[id].y,"red", obj[id].radius, this);

					if (obj[id].role == "circle") 
						this.worldObjects[id] = CircleFactory(obj[id].x, obj[id].y,"red", obj[id].radius);

					if (obj[id].role == "enemy")
						this.worldObjects[id] = EnemyFactory(obj[id].x, obj[id].y, "red", obj[id].radius);
				}
			}

			this.initCanvas = function(canvasID) {
				this.canvas = document.getElementById(canvasID);
				this.context = this.canvas.getContext('2d');

				this.context.beginPath();
				this.context.rect(0, 0, this.canvas.width, this.canvas.height);
				this.context.fillStyle = 'yellow';
				this.context.fill();
				this.context.lineWidth = 7;
				this.context.strokeStyle = 'black';
				this.context.stroke();
			}

			this.initAnimationFrame = function() {
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

			this.bindInput = function() {
				var self = this;
				document.addEventListener("mousedown", function(e) {
					this.isMouseDown = true;
					handleMouseMove(e);
					document.addEventListener("mousemove", handleMouseMove, true);
				}, true);

				document.addEventListener("mouseup", function() {
					document.removeEventListener("mousemove", handleMouseMove, true);
					this.isMouseDown = false;
					this.mouseX = undefined;
					this.mouseY = undefined;
				}, true);

				function handleMouseMove(e) {
					var position = $("#canvas").position();
					this.mouseX = (((e.clientX - self.canvas.getBoundingClientRect().left) - position.left)) / fitViewportToRatio.getScalar();
					this.mouseY = (((e.clientY - self.canvas.getBoundingClientRect().top) - position.top)) / fitViewportToRatio.getScalar();
				};
			}

			/* ---- GAME LOOP ----------------------------- */

			this.start = function() {
				var self = this;

				(function loop(animStart) {
					self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);

					self.elapsed = self.lastTime ? (new Date().getTime() - self.lastTime) / 1000.0 : 0.0;

					self.elapsed = self.elapsed > 0.05 ? 0.05 : self.elapsed;

					self.update(self.elapsed);
					self.draw(self.elapsed);

					self.lastTime = new Date().getTime();

					window.requestAnimFrame(loop);
				})();
			}

			this.update = function(elapsed) {
				for (var id in this.worldObjects) {
					this.worldObjects[id].update(this.elapsed, this.worldObjects);
				}
			}

			this.draw = function(elapsed) {
				this.frameRateElapsed += elapsed;
				this.frameCount++;

				if (this.frameRateElapsed >= 1.0)
				{
					this.frameRate = (1.0 / this.frameRateElapsed) * this.frameCount;

					this.frameRateElapsed = this.frameCount = 0;
				}

				Isometric.view(this.player.position.x, this.player.position.y, 1.0, 0.5, 1.0, this.canvas.width, this.canvas.height);

				this.tileMap.draw(this.elapsed, this.context);

				for (var id in this.worldObjects) {
					this.worldObjects[id].draw(elapsed, this.context);
				}

				this.context.font="20px Arial";
				this.context.fillText("FPS: " + Math.round(this.frameRate).toString(10),5,50);
				this.context.fillText("elapsed: " + (Math.round(this.elapsed * 1000) / 1000).toString(10),5,100);
			}
		}

		return new DieZombieEngine();
	}
);