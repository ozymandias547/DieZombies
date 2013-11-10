define(["Entity", "vec2", "Sprite"], function(Entity, Vec2, Sprite) {

	var PlayerEntity = function(x, y, color, radius) {
		Entity().constructor.call(this, x, y, color);
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



			if (this.isReady) {
				switch (this.previousPressed) {
					case "up":
						this.runningUp.draw(this.currentSprite, this.position.x, this.position.y);
						break;
					case "right":
						this.runningRight.draw(this.currentSprite, this.position.x, this.position.y);
						break;
					case "down":
						this.runningDown.draw(this.currentSprite, this.position.x, this.position.y);
						break;
					case "left":
						this.runningLeft.draw(this.currentSprite, this.position.x, this.position.y);
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
			this.velocity.sMultiplyEq(this.groundFriction)
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

	return function(x, y, color, radius) {
		return new PlayerEntity(x, y, color, radius)
	}

});