 require.config({
 	baseUrl: "js",
 	paths: {
 		"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min",
 		"fitViewportToRatio": "lib/fitViewportToRatio",
 		"dieZombieEngine": "lib/dieZombieEngine",
 		"vec2": "lib/vec2",
 		"tileMap": "lib/map/tileMap",
 		"grass": "lib/map/grass",
 		"Entity": "lib/entity/Entity",
 		"PlayerFactory": "lib/entity/PlayerEntity",
 		"CircleFactory": "lib/entity/CircleEntity",
 		"EnemyFactory": "lib/entity/EnemyEntity",
 		"Sprite": "lib/Sprite",
 		"isometric" : "lib/map/isometric"
 	},

 	waitSeconds: 15
 });


 require(['jquery', 'dieZombieEngine', 'fitViewportToRatio'], function($, dieZombieEngine, fitViewportToRatio) {

 	$(document).ready(function() {

 		dieZombieEngine.init("canvas");
 		dieZombieEngine.start();


 		$(window).on("resize", fitViewportToRatio.calculate);
 		$(window).trigger("resize")
 	});

 });