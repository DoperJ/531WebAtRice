'use strict';

var createApp = function(canvas) {
    var c = canvas.getContext("2d");

    // Create the ground
    var floor = canvas.height/2;
    var grad = c.createLinearGradient(0,floor,0,canvas.height);
    grad.addColorStop(0, "green");
    grad.addColorStop(1, "black");
    c.fillStyle=grad;
    c.fillRect(0, floor, canvas.width, canvas.height);

    // common size for windows
    var windowSpacing = 2, floorSpacing = 3;
    var windowHeight = 5, windowWidth = 3;

    // colors of buildings
    var blgColors = [ 'red', 'blue', 'gray', 'orange'];

    //build a building
    var build = function() {
        var x0 = Math.random()*canvas.width;
        var blgWidth = (windowWidth+windowSpacing) * Math.floor(Math.random()*10);
        var blgHeight = Math.random()*canvas.height/2;

        c.fillStyle= blgColors[ Math.floor(Math.random()*blgColors.length)];
        c.fillRect(x0, floor - blgHeight, blgWidth, blgHeight);
        c.fillStyle="yellow";

        const dx = floorSpacing + windowHeight;
        const dy = windowSpacing + windowWidth;
        const floors = Math.floor(blgHeight/dx);
        const rows = Math.floor(blgWidth/dy) - 1;
        const range = (n, delta, x0) => Array(n).fill(1).map((_, i) => x0 + i * delta);
        range(floors, dx, floor - blgHeight + dx).forEach(y => {
            range(rows, dy, windowSpacing).forEach(x => {
            c.fillRect(x0 + x, y - windowHeight, windowWidth, windowHeight)
    })
    })
    };

    return {
        build: build
    }
};

window.onload = function() {
    var app = createApp(document.querySelector("canvas"));
    document.getElementById("build").onclick = app.build;


    var ctx = document.querySelector("canvas").getContext("2d");
/*    ctx.beginPath();
    ctx.arc(100,75,50,0,2*Math.PI);
    ctx.stroke();
    ctx.fillStyle = "yellow";
    ctx.fill();*/
    var pos = 0;
    setInterval(function(){
        //清除出一个矩阵
        ctx.clearRect(0, 24, 800, 110);
        ctx.beginPath();
        ctx.arc(pos,75,50,0,2*Math.PI);
        ctx.stroke();
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
        pos++;
        if(pos>800){
            pos=0;
        }
    },3);
};

