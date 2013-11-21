define(["Humanoid", "vec3", "Sprite","dieZombieEngine", "isometric"], function(Humanoid, Vec3, Sprite, Engine, Iso) {

	var EnemyEntity = function(name, x, y, z, color, radius, engine) {
		Humanoid.call(this, name, x, y, z, color, radius, engine);
	
		this.image = new Image();
		this.image.src = "assets/OrcExample.png";

		this.image.onload = function() {
			this.isReady = true;
			this.runningDown = new Sprite(this.image, 300, 40, 40, [
				[0, 0],
				[40, 0],
				[80, 0]
			]);
			this.runningRight = new Sprite(this.image, 300, 40, 40, [
				[0, 40],
				[40, 40],
				[80, 40]
			]);
			this.runningUp = new Sprite(this.image, 300, 40, 40, [
				[0, 80],
				[40, 80],
				[80, 80]
			]);
			this.runningLeft = new Sprite(this.image, 300, 40, 40, [
				[0, 120],
				[40, 120],
				[80, 120]
			]);
		}.bind(this);

	}

	EnemyEntity.prototype = new Humanoid();
	EnemyEntity.prototype.constructor = EnemyEntity;

	EnemyEntity.prototype.drawSprite  = function(elapsed, context, x, y) {
		if (this.isReady) {
			this.runningLeft.draw(context, elapsed, x, y);
		}
	}

	return EnemyEntity;

});