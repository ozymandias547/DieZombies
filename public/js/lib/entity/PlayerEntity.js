define(["Humanoid", "vec3", "Sprite", "isometric"], function(Humanoid, Vec3, Sprite, Iso) {
	var PlayerEntity = function(name, x, y, z, color, radius, engine) {
		
		Humanoid.call(this, name, x, y, z, color, radius, engine);

		this.upPressed = false,
		this.downPressed = false,
		this.rightPressed = false,
		this.leftPressed = false;
		this.previousPressed = "right";

		document.addEventListener("keydown", this.handleKeyDown.bind(this))
		document.addEventListener("keyup", this.handleKeyUp.bind(this))
	}

	PlayerEntity.prototype = new Humanoid();
	PlayerEntity.prototype.constructor = PlayerEntity;


	PlayerEntity.prototype.handleControls = function(elapsed) {
		var deltaX = 0,
			deltaY = 0;

		if (this.upPressed) {
			deltaX = this.moveStep * elapsed;
			deltaY -= this.moveStep * elapsed;
		} else if (this.downPressed) {
			deltaX -= this.moveStep * elapsed;
			deltaY += this.moveStep * elapsed;
		}

		if (this.rightPressed) {
			deltaX += this.moveStep * elapsed;
			deltaY += this.moveStep * elapsed;
		} else if (this.leftPressed) {
			deltaX -= this.moveStep * elapsed;
			deltaY -= this.moveStep * elapsed;
		}

		var allowHorizontal = true;

		if (this.tile) {
			allowHorizontal = false;
			var deltaZ = this.tile.z() - this.position.z;

			// Normalize (-1, 0, or 1) from float
			var dx = deltaX ? (deltaX > 0 ? 10 : -10) : 0;
			var dy = deltaY ? (deltaY > 0 ? 10 : -10) : 0;

			// Here we find the destination tile IF we allow the user to continue pressing the key
			// that they are pressing.
			var destTile = this.engine.tileMap.getTileAt(this.position.x + dx, this.position.y + dy);
			var destZ = destTile.z();

			// Do we need to climb?
			if (deltaZ > 0) {
				// Is the user requesting to move toward the tile we are on that is
				// higher than we are? Then climb.
				if ((dx || dy) && destTile == this.tile) {
					this.velocity.z += 500 * elapsed;
				} else {
					// In this case, we just allow the user to continue moving OFF the tile
					// that they are climbing onto and this will automatically put them in fall
					// state.
					allowHorizontal = true;
				}
			} else if (deltaZ < 0) {
				// Falling!
				this.velocity.z -= 1000 * elapsed;
			} else {
				allowHorizontal = true;
			}
		}

		if (allowHorizontal) {
			this.velocity.vPlusEq(new Vec3(deltaX, deltaY, 0));
		}
	}

	PlayerEntity.prototype.handleKeyDown =function(e) {
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
	}

	PlayerEntity.prototype.handleKeyUp = function(e) {
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

	return PlayerEntity;
});