define(["Entity", "vec3", "Sprite", "isometric"], function(Entity, Vec3, Sprite, Iso) {
	var PlayerEntity = function(x, y, z, color, radius, engine) {
		Entity().constructor.call(this, x, y, z, color);
		this.engine = engine;
		this.radius = radius;
		this.moveStep = 500;
		this.maxSpeed = 1000;
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
		this.image.src = "assets/GirlDarkExample.png";

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

	PlayerEntity.prototype = Entity();
	PlayerEntity.prototype.constructor = PlayerEntity;

	PlayerEntity.prototype = {
		draw: function(elapsed, context) {

			Iso.view(this.position.x, this.position.y, 1.0, 0.5, 1.0, canvas.width, canvas.height);

			if (this.isMoving(.2)) {
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

			var x = Iso.pX(this.position.x, this.position.y);
			var y = Iso.pY(this.position.x, this.position.y, this.position.z);

			if (this.isReady) {
				switch (this.previousPressed) {
					case "up":
						this.runningUp.draw(context, this.currentSprite, x, y);
						break;
					case "right":
						this.runningRight.draw(context, this.currentSprite, x, y);
						break;
					case "down":
						this.runningDown.draw(context, this.currentSprite, x, y);
						break;
					case "left":
						this.runningLeft.draw(context, this.currentSprite, x, y);
						break;
				}
			}
		},

		isMoving: function() {
			return this.velocity.x > this.threshold ||
				this.velocity.x < -this.threshold ||
				this.velocity.y > this.threshold ||
				this.velocity.y < -this.threshold ||
				this.velocity.z > this.threshold ||
				this.velocity.z < -this.threshold;
		},

		update: function(elapsed, worldObjects) {

			this.handleControls(elapsed);
			this.velocity.sMultiplyEq(this.groundFriction)
			this.velocity.sRestrictEq(this.maxSpeed);
			this.position.vPlusEq(this.velocity.sMultiply(elapsed));

			this.tile = this.engine.tileMap.getTileAt(this.position.x, this.position.y);

			if (this.tile)
			{
				this.position.z = this.tile.z();
			}
		},

		handleControls: function(elapsed) {

			if (this.upPressed) {
				this.velocity.x += this.moveStep * elapsed;
				this.velocity.y -= this.moveStep * elapsed;
			} else if (this.downPressed) {
				this.velocity.x -= this.moveStep * elapsed;
				this.velocity.y += this.moveStep * elapsed;
			}

			if (this.rightPressed) {
				this.velocity.x += this.moveStep * elapsed;
				this.velocity.y += this.moveStep * elapsed;
			} else if (this.leftPressed) {
				this.velocity.x -= this.moveStep * elapsed;
				this.velocity.y -= this.moveStep * elapsed;
			}
		},

		handleKeyDown: function(e) {
			switch (e.which) {
				case 87:
					this.upPressed = true;
					this.previousPressed = "up";
					break;
				case 83:
					this.downPressed = true;
					this.previousPressed = "down";
					break;
				case 68:
					this.rightPressed = true;
					this.previousPressed = "right";
					break;
				case 65:
					this.leftPressed = true;
					this.previousPressed = "left";
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
	};

	return function(x, y, z, color, radius, engine) {
		return new PlayerEntity(x, y, z, color, radius, engine);
	}
});