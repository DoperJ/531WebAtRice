function Manager() {
    this.weedInterval = undefined;
    this.canvas = $("#canvas")[0];
    this.ctx = canvas.getContext("2d");
    this.h = new Horizon(canvas, conf.horizonHeght);
    this.runner = new Runner(canvas, 10, conf.horizonHeght, 64, 52);
    this.isLost = false;
    this.score = 0;
}

Manager.prototype = {
    start: function () {
        this.h.draw();
        this.runner.render();
        this.weedInterval = setInterval(()=>{
            let seaweed = new SeaWeed(this.canvas, conf.width, conf.horizonHeght, 35, 70, this.runner);
            seaweed.render();
        }, 3000);
        this.ctx.clearRect(0, 0, conf.width, 50);
        this.ctx.font = '20px sans-serif';
        //seaweed.render();
        this.drawHighestScore();
        let that = this;
        document.onkeydown = function (event) {
            if (event.key === "ArrowUp" && !that.runner.isJumping) {
                console.log("up" + that.isLost);
                if (!that.isLost) {
                    that.runner.jump();
                }
            }
        };
    },
    drawHighestScore: function() {
        let highestScore = $.cookie('highest_score');
        highestScore = highestScore == null ? 0 : highestScore;
        this.ctx.fillText('Highest Score is: ' + highestScore, 250, 50, 300);
    },
    stop: function () {
        clearInterval(this.weedInterval);
    },
    fail: function () {
        this.stop();
        console.log("gg");
        setInterval(()=>{
            this.ctx.clearRect(0, 0, conf.width, conf.height);
            this.ctx.font = '20px sans-serif';
            this.ctx.fillText('You Lost! Your Score is: ' + manager.score, conf.width / 2 - 150, conf.height / 2, 300);
            let highestScore = $.cookie('highest_score');
            highestScore = highestScore == null ? manager.score : Math.max(highestScore, manager.score);
            $.cookie('highest_score', highestScore);
        }, 1);
        //this.start();
    }
};
function Horizon(canvas, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.height = height;
    this.x = [0, conf.width];
    this.y = conf.height - height;
}

Horizon.prototype = {
    draw: function () {
/*        console.log(this.x);
        console.log("drawing" + " " + this.y);*/
        this.ctx.beginPath();
        this.ctx.moveTo(this.x[0], this.y);
        this.ctx.lineTo(this.x[1], this.y);
        this.ctx.stroke();
    }
};

function Runner(canvas, x, y, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.x = x;
    this.y = conf.height - y - height - 5;
    this.originY = this.y;
    this.topY = this.y - conf.jumpHeight;
    this.width = width;
    this.height = height;
    this.img = document.createElement("img");
    this.dir = 1;
    this.isJumping = false;
}

Runner.prototype = {
    render: function () {
        //img.src = "docker.png";
        //this.img.src = "docker-bubble.jp";
        //this.img.src = "2.gif";
        this.img.src = "cute-whale.png";
        let that = this;
        this.img.onload = function() {
            console.log(that.img);
            that.ctx.drawImage(that.img, that.x, that.y, that.width, that.height);
        }
    },
    clear: function() {
        this.ctx.clearRect(this.x, this.y, this.width, this.height);
    },
    jump: function () {
        let that = this;
        this.isJumping = true;
        let interval = setInterval(function () {
            that.clear();
            if (that.dir === 1) {
                that.y-- ;
            } else {
                that.y++;
            }
            if (that.y <= that.topY) {
                that.dir = 0;
            }
            that.ctx.drawImage(that.img, that.x, that.y, that.width, that.height);
            if (that.dir === 0 && that.y >= that.originY) {
                that.dir = 1;
                that.isJumping = false;
                clearInterval(interval);
            }
        }, 1);
    }
};

function SeaWeed(canvas, x, y, width, height, runner) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.x = x;
    this.y = conf.height - y - height - 5;
    this.width = width;
    this.height = height;
    this.img = document.createElement("img");
    this.runner = runner;
}

SeaWeed.prototype = {
    render: function () {
        this.img.src = "seaweed1.png";
        let that = this;
        this.img.onload = function () {
            let interval = setInterval(function () {
                that.ctx.clearRect(that.x, that.y, that.width, that.height);
                that.x--;
/*                if (that.y <= that.topY) {
                    that.dir = 0;
                }*/
                if (that.kill()) {
                    manager.isLost = true;
                    //that.runner.render();
                    clearInterval(interval);
                    manager.fail();
                    return;
                }
                that.ctx.drawImage(that.img, that.x, that.y, that.width, that.height);
                if (that.x + that.width <= 0) {
                    clearInterval(interval);
                    manager.score += 100;
                    //console.log(manager.score);
                }
            }, 1);
        }
    },
    kill: function () {
        let heightReach = (this.runner.y + this.runner.height) > this.y + 20;
        //console.log("height reached: " + heightReach);
        let leftBetween = (this.x < this.runner.x + this.runner.width) && (this.x > this.runner.x);
        let rightBetween = (this.x + this.width < this.runner.x + this.runner.width) && (this.x + this.width > this.runner.x);
        return heightReach && (leftBetween || rightBetween);
    }
};


function Config() {
    this.width = 500;
    this.height = 400;
    this.jumpHeight = 150;
    this.speed = 4;
    this.horizonHeght = 50;
}

$(function () {
    window.conf = new Config();
    window.manager = new Manager();
    //$.cookie('highest_score', 0);
    manager.start();
});