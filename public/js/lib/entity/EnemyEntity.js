define(["Entity", "vec2", "Sprite", "isometric"], function(Entity, Vec2, Sprite, Isometric) {

	var EnemyEntity = function(x, y, color, radius) {
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

		
	}

	EnemyEntity.prototype = Entity();
	EnemyEntity.prototype.constructor = EnemyEntity;

	EnemyEntity.prototype = {

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
				
						// this.runningUp.draw(this.currentSprite, this.position.x, this.position.y);
						
						// this.runningRight.draw(this.currentSprite, this.position.x, this.position.y);
						
						// this.runningDown.draw(this.currentSprite, this.position.x, this.position.y);
						
						// this.runningLeft.draw(this.currentSprite, this.position.x, this.position.y);
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
			this.velocity.sMultiplyEq(this.groundFriction)
			this.velocity.sRestrictEq(this.maxSpeed);
			this.position.vPlusEq(this.velocity)
		}

		
	}

	return function(x, y, color, radius) {
		return new EnemyEntity(x, y, color, radius)
	}

});