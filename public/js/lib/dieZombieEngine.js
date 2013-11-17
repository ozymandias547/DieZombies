define(['fitViewportToRatio', 'vec3', 'tileMap', 'DebugState', 'Entity', 'PlayerEntity', 'EnemyEntity', 'isometric'],
	function(fitViewportToRatio, Vec3, TileMap, DebugState, Entity, PlayerEntity, EnemyEntity, Isometric) {
		var DieZombieEngine = function() {
			this.canvas = null;
			this.canvasHitDetection = null;
			this.canvii = [];
			this.curCanvasIX = 0;

			this.worldObjects = {};
			this.mouseX = -1;
			this.mouseY = -1;
			this.isMouseDown = false;
			this.lastTime = 0;
			this.tileMap = new TileMap(200, 200, 50, 50);
			this.frameRateElapsed = 0;
			this.frameRate = 0;
			this.frameCount = 0;
			this.frameCap = 200;

			/* ---- INITIALZING ----------------------------- */
			this.curCanvas = function() {
				return this.canvii[this.curCanvasIX];
			};

			this.enterState = function(state) {
				if (this.state) {
					this.state.exit();
				}

				this.state = state;

				if (this.state) {
					this.state.enter();
				}
			};

			this.init = function() {
				this.initCanvas();
				this.initAnimationFrame();
				this.bindInput();

				this.addPlayer({
					id: "player1",
					role: "player",
					x: 100,
					y: 100,
					radius: 20,
					color: "green"
				});

				this.addEnemy({
					id: "enemy1",
					role: "enemy",
					x: 100,
					y: 100,
					radius: 30,
					color: "red"
				})

			}

			this.addPlayer = function(obj) {
				this.worldObjects[obj.id] = this.player = new PlayerEntity(obj.id, obj.x, obj.y, NaN, "red", obj.radius, this);
			}

			this.addEnemy = function(obj) {
				this.worldObjects[obj.id] = new EnemyEntity(obj.id, obj.x, obj.y, NaN, "red", obj.radius, this);
			}


			this.initCanvas = function() {
				this.canvii = [document.getElementById("canvas0"), document.getElementById("canvas1")];

				this.canvasHitDetection = document.getElementById("canvasHitDetection");
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
					this.mouseX = (((e.clientX - self.curCanvas().getBoundingClientRect().left) - position.left)) / fitViewportToRatio.getScalar();
					this.mouseY = (((e.clientY - self.curCanvas().getBoundingClientRect().top) - position.top)) / fitViewportToRatio.getScalar();
				};
			}


			/* ---- GAME LOOP ----------------------------- */

			this.start = function() {
				var self = this;

				(function loop(animStart) {
					self.elapsed = self.lastTime > 0 ? ((new Date().getTime() - self.lastTime) / 1000.0) : 0.0;

					if (self.elapsed == 0 && self.lastTime) {
						window.requestAnimFrame(loop);
						return;
					}

					self.lastTime = new Date().getTime();

					self.elapsed = self.elapsed > 0.05 ? 0.05 : self.elapsed;

					self.update(self.elapsed);
					self.draw(self.elapsed);

					window.requestAnimFrame(loop);
				})();
			};

			this.update = function(elapsed) {
				for (var id in this.worldObjects) {
					this.worldObjects[id].update(this.elapsed, this.worldObjects);
				}
			};

			this.draw = function(elapsed) {
				this.context = this.curCanvas().getContext('2d');
				this.context.clearRect(0, 0, this.curCanvas().width, this.curCanvas().height);

				this.contextHit = this.canvasHitDetection.getContext('2d');
				this.contextHit.clearRect(0, 0, this.curCanvas().width, this.curCanvas().height);

				this.frameRateElapsed += elapsed;
				this.frameCount++;

				if (this.frameRateElapsed >= 1.0) {
					this.frameRate = (1.0 / this.frameRateElapsed) * this.frameCount;
					this.frameRateElapsed = this.frameCount = 0;
				}

				Isometric.view(this.player.position.x, this.player.position.y, this.player.position.z, 1.0, 0.5, 1.0, this.curCanvas().width, this.curCanvas().height);

				var zBuff = this.tileMap.getRenderableTilesFrom(this.player.tile).all;

				zBuff.sort(function(a, b) {
					return a.z - b.z;
				});

				for (var i = 0; i < zBuff.length; i++) {
					zBuff[i].renderer.draw(elapsed, this.context, this.contextHit);
				}

				this.context.font = "16px Arial";
				this.context.fillText("FPS: " + Math.round(this.frameRate).toString(10), 5, 50);
				this.context.fillText("elapsed: " + (Math.round(this.elapsed * 1000) / 1000).toString(10), 5, 75);
				this.context.fillText("tiles: " + zBuff.length, 5, 100);
			};

			this.enterState(DebugState);
		}

		return new DieZombieEngine();
	});