define(['bullet', 'mouseController', 'world', 'vec2'], function(bullet, mouseController, world, Vec2) {

	var ShotGun = function() {

	}

	ShotGun.prototype = {
		equip: function() {
			//activate the gun and bind shoot to mouseController click
			mouseController.addClickEvent("shotgun", this.shoot);
		},
		unEquip: function() {
			mouseController.removeClickEvent("shotgun");
		},
		shoot: function(player) {
			//add new bullets to the world and send them on their way

			var direction = new Vec2(mouseController.mouseX, mouseController.mouseY);
			direction.vSubEq(player.position)
			direction.normalize();

			world.addObject(bullet({
				direction: direction,
				position: player.position,
				speed: "500",
				graphics: "line",
				power: "1"
			}));
		}
	}

	return function() {
		return new Gun()
	}

});