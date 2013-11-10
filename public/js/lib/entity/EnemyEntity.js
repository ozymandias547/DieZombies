define(["Entity", "vec2", "Sprite", "isometric"], function(Entity, Vec2, Sprite, Iso) {

	var EnemyEntity = function(x, y, color, radius) {
		Entity().constructor.call(this, x, y, color);
		this.radius = radius;
		this.moveStep = .5;
		this.isReady = false;
		this.currentSprite = 0;
		this.spriteFrequency = 200; //in milliseconds
		this.elapsedTime = 0;
		this.lastTime = new Date();

		this.direction = new Vec2(1,1);
		this.speed = .5;

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

			var x = Iso.pX(this.position.x, this.position.y);
			var y = Iso.pY(this.position.x, this.position.y, 0);

			

			if (this.isReady) {


				// this.runningUp.draw(this.currentSprite, this.position.x, this.position.y);
				// this.runningRight.draw(this.currentSprite, this.position.x, this.position.y);
				this.runningDown.draw(this.currentSprite, x, y);
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

		update: function(elapsedTime, worldObjects) {

			//follow the player
			//find angle between enemy and player (get direction)
			//normalize
			//multiply by speed
			var player = worldObjects["player1"]; // this will need to be redone to step through all players and find the closest
			
			this.direction.x = player.position.x - this.position.x;
			this.direction.y = player.position.y - this.position.y;
			this.direction.normalize();
			this.direction.sMultiplyEq(this.speed);
			this.velocity = this.direction;
			this.position.vPlusEq(this.velocity);
			
		}


	}

	return function(x, y, color, radius) {
		return new EnemyEntity(x, y, color, radius)
	}

});