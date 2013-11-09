 require.config({
 	baseUrl: "js/lib",
 	paths: {
 		"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min",
 		"fitViewportToRatio": "fitViewportToRatio",
 		"dieZombieEngine": "dieZombieEngine"
 	},
 	waitSeconds: 15
 });


 require(['jquery', 'dieZombieEngine', 'fitViewportToRatio'], function($, dieZombieEngine, fitViewportToRatio) {

 	$(document).ready(function() {


 		dieZombieEngine.init("canvas");

 		$(".goFullScreen").on("click", function() {
 			$("#screen").requestFullScreen();
 		})

 		$(window).on("resize", fitViewportToRatio.calculate);
 		$(window).trigger("resize")
 	});

 });