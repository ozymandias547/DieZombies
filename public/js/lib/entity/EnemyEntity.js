define(["Humanoid", "vec3", "Sprite","dieZombieEngine", "isometric"], function(Humanoid, Vec3, Sprite, Engine, Iso) {

	var EnemyEntity = function(name, x, y, z, color, radius, engine) {
		Humanoid.call(this, name, x, y, z, color, radius, engine);
	}

	EnemyEntity.prototype = new Humanoid();
	EnemyEntity.prototype.constructor = EnemyEntity;

	return EnemyEntity;

});