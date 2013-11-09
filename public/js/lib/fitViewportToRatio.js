 
define(['jquery'], function($) {


     
    var ratioWidth = 800,
        ratioHeight = 400,
        windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        targetWidth, targetHeight, 
        tTop = 0, 
        tLeft = 0,
        scalar = 1,
        $wrapper = $("#screen");

    function calculate() {
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        
        if (windowWidth / (windowWidth + windowHeight) > ratioWidth / (ratioWidth + ratioHeight)) {
            targetHeight = windowHeight
            targetWidth = (ratioWidth / ratioHeight) * targetHeight
            tTop = 0
            tLeft = (windowWidth - targetWidth) / 2
        }
        else if (windowHeight / (windowWidth + windowHeight) > ratioHeight / (ratioWidth + ratioHeight)) {
            targetWidth = windowWidth
            targetHeight = (ratioHeight / ratioWidth) * targetWidth
            tLeft = 0
            tTop = (windowHeight - targetHeight) / 2
        }
        else {
            targetWidth = windowWidth;
            targetHeight = windowWidth;
            tLeft = 0
            Top = 0
        }

        //find scale scalar
        scalar = targetWidth / ratioWidth;
        setViewport();
    }

    function setViewport() {
        $("#screen").css({
            "transform" : "scale3d(" + scalar + ", " + scalar + ", 1)",
            "-ms-transform" : "scale3d(" + scalar + ", " + scalar + ", 1)",
            "-webkit-transform" : "scale3d(" + scalar + ", " + scalar + ", 1)",
            "transform-origin" : "0px 0px",
            "-webkit-transform-origin" : "0px 0px",
            "-ms-transform-origin" : "0px 0px",
            "left" : tLeft + "px",
            "top" : tTop + "px"
        })
    }

    function setargetWidthrapper($canvasWrapper) {
        $wrapper = $canvasWrapper;
    }

    return {
        calculate : calculate,
        setargetWidthrapper : setargetWidthrapper,
        scalar : scalar
    }
    
})


