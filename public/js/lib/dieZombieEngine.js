define(['fitViewportToRatio', 'vec2', 'tileMap', 'Entity', 'CircleFactory', 'PlayerFactory', 'EnemyFactory', 'isometric'],
	function (fitViewportToRatio, Vec2, TileMap, Entity, CircleFactory, PlayerFactory, EnemyFactory, Isometric)
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
						this.worldObjects[id] = this.player = PlayerFactory(obj[id].x, obj[id].y,"red", obj[id].radius)

					if (obj[id].role == "circle") 
						this.worldObjects[id] = CircleFactory(obj[id].x, obj[id].y,"red", obj[id].radius)

					if (obj[id].role == "enemy")
						this.worldObjects[id] = EnemyFactory(obj[id].x, obj[id].y, "red", obj[id].radius)
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
				document.addEventListener("mousedown", function(e) {
					this.isMouseDown = true;
					this.handleMouseMove(e);
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
					this.mouseX = (((e.clientX - this.canvas.getBoundingClientRect().left) - position.left)) / fitViewportToRatio.getScalar();
					this.mouseY = (((e.clientY - this.canvas.getBoundingClientRect().top) - position.top)) / fitViewportToRatio.getScalar();
				};
			}

			/* ---- GAME LOOP ----------------------------- */

			this.start = function() {
				(function loop(animStart) {
					this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

					var elapsed = this.lastTime ? (new Date().getTime() - this.lastTime) / 1000.0 : 0.0;

					this.update(elapsed);
					this.draw(elapsed);

					this.lastTime = new Date().getTime();

					this.requestAnimFrame(loop);
				})();
			}

			this.update = function(elapsed) {
				for (var id in this.worldObjects) {
					this.worldObjects[id].update(this.elapsed, this.worldObjects);
				}
			}

			this.draw = function(elapsed) {
				Isometric.view(this.player.position.x, this.player.position.y, 1.0, 0.5, 1.0, this.canvas.width, this.canvas.height);

				tileMap.draw(this.elapsed, this.context);

				for (var id in this.worldObjects) {
					this.worldObjects[id].draw(elapsed, this.context);
				}
			}
		}

		return new DieZombieEngine();
	}
);