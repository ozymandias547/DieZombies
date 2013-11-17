 require.config({
 	baseUrl: "js",
 	paths: {
 		"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min",
 		"fitViewportToRatio": "lib/fitViewportToRatio",
 		"dieZombieEngine": "lib/dieZombieEngine",
 		"vec3": "lib/vec3",
 		"tileMap": "lib/map/tileMap",
 		"grass": "lib/map/grass",
 		"Entity": "lib/entity/Entity",
 		"Humanoid": "lib/entity/Humanoid",
 		"PlayerEntity": "lib/entity/PlayerEntity",
 		"EnemyEntity": "lib/entity/EnemyEntity",
 		"Sprite": "lib/Sprite",
 		"isometric" : "lib/map/isometric",
 		"Tile" : "lib/map/Tile",
 		"Screen" : "lib/map/Screen",
 		"AbstractState": "lib/gameStates/AbstractState",
 		"DebugState" : "lib/gameStates/DebugState"
 	},

 	waitSeconds: 15
 });

 require(['jquery', 'dieZombieEngine', 'fitViewportToRatio'], function($, dieZombieEngine, fitViewportToRatio) {

 	$(document).ready(function() {

 		dieZombieEngine.init();
 		dieZombieEngine.start();

 		$(window).on("resize", fitViewportToRatio.calculate);
 		$(window).trigger("resize")
 	});
 });