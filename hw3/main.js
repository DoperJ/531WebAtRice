function Manager() {
    this.weedInterval = undefined;
    this.eventTarget = $("#canvas");
    this.canvas = this.eventTarget[0];
    this.ctx = canvas.getContext("2d");
    this.h = new Horizon(canvas, conf.horizonHeght);
    this.runner = undefined;
    this.isLost = false;
    this.score = 0;
    this.runnerInterval = 0;
    this.seaweeds = [];
    this.seaweeds.push([35, 70, "seaweed1.png"]);
    this.seaweeds.push([40, 80, "seaweed2.png"]);
    this.seaweeds.push([70, 80, "seaweed3.png"]);
    this.level = 1;
    //console.log(this.seaweeds);
    let that = this;
    this.eventTarget.click(function (event) {
        if (!that.runner.isJumping) {
            //console.log("up" + that.isLost);
            if (!that.isLost) {
                that.runner.jump();
            }
        }
        if (that.isLost) {
            let x = event.offsetX;
            let y = event.offsetY;
            let l = conf.failedImgX, r = conf.failedImgX + conf.failedImgWidth;
            let t = conf.failedImgY, b = conf.failedImgY + conf.failedImgHeight;
            if (x >= l && x <= r && y >= t && y <= b) {
                that.start();
            }
            //console.log(x + ", " + y);
        }
    });
}

Manager.prototype = {
    init: function() {
        this.isLost = false;
        this.level = 1;
        this.score = 0;
        this.runner = new Runner(this.canvas, 10, conf.horizonHeght, 64, 52);
    },
    start: function () {
        this.init();
        this.ctx.clearRect(0, 0, conf.width, conf.height);
        this.h.draw();
        this.runner.render();
        this.drawHighestScore();
        this.drawCurrentScore();
        this.drawLevel();
        this.weedInterval = setInterval(() => {
           let level = parseInt(manager.score / 200) + 1;
            level = Math.min(level, this.seaweeds.length);
            this.level = level;
            let next = parseInt(Math.random() * level);
            //console.log(level + ", " + next);
            this.drawLevel();
            let nextSeaweedConfig = manager.seaweeds[next];
            let seaweed = new SeaWeed(this.canvas, conf.width, conf.horizonHeght,
                nextSeaweedConfig[0], nextSeaweedConfig[1], this.runner, nextSeaweedConfig[2]);
            seaweed.render();
        }, 3000 - this.level * 500);
        //seaweed.render();
    },
    drawHighestScore: function() {
        this.ctx.clearRect(0, 0, conf.width, 40);
        this.ctx.font = '20px sans-serif';
        let highestScore = $.cookie('highest_score');
        highestScore = highestScore == null ? 0 : highestScore;
        this.ctx.fillText('Highest Score: ' + highestScore, 250, 50, 300);
    },
    drawCurrentScore: function() {
        this.ctx.clearRect(0, 50, conf.width, 40);
        this.ctx.font = '20px sans-serif';
        this.ctx.fillText('Current Score: ' + manager.score, 250, 80, 300);
    },
    drawLevel: function() {
        this.ctx.clearRect(0, 80, conf.width, 40);
        this.ctx.font = '20px sans-serif';
        this.ctx.fillText('Difficulty Level: ' + this.level, 250, 110, 300);
    },
    stop: function () {
        clearInterval(this.weedInterval);
    },
    fail: function () {
        this.stop();
        //console.log("gg");
        this.ctx.clearRect(0, 0, conf.width, conf.height);
        this.ctx.font = '20px sans-serif';
        this.ctx.fillText('You lost! Your score is ' + manager.score, conf.width / 2 - 100, conf.height / 2 - 80, 300);
        this.ctx.fillText('Click the image to restart...', conf.width / 2 - 100, conf.height / 2 - 40, 300);
        let highestScore = $.cookie('highest_score');
        highestScore = highestScore == null ? manager.score : Math.max(highestScore, manager.score);
        $.cookie('highest_score', highestScore);
        let failedImg = document.createElement("img");
        failedImg.src = conf.failedImgSrc;
        let that = this;
        failedImg.onload = function() {
            //console.log(that.img);
            that.ctx.drawImage(failedImg, conf.failedImgX, conf.failedImgY, conf.failedImgWidth, conf.failedImgHeight);
        };
        manager.isLost = true;
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
        this.img.src = "cute-whale.png";
        let that = this;
        this.img.onload = function() {
            //console.log(that.img);
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
        manager.runnerInterval = interval;
    }
};

function SeaWeed(canvas, x, y, width, height, runner, url) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.x = x;
    this.y = conf.height - y - height - 5;
    this.width = width;
    this.height = height;
    this.img = document.createElement("img");
    this.runner = runner;
    this.url = url;
}

SeaWeed.prototype = {
    render: function () {
        this.img.src = this.url;
        let that = this;
        this.img.onload = function () {
            let interval = setInterval(function () {
                that.ctx.clearRect(that.x, that.y, that.width, that.height);
                that.x--;
/*                if (that.y <= that.topY) {
                    that.dir = 0;
                }*/
                if (that.kill()) {
                    //that.runner.render();
                    clearInterval(interval);
                    clearInterval(manager.runnerInterval);
                    manager.fail();
                    return;
                }
                that.ctx.drawImage(that.img, that.x, that.y, that.width, that.height);
                if (that.x + that.width <= 0) {
                    clearInterval(interval);
                    manager.score += 100;
                    manager.drawCurrentScore();
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
    this.failedImgX = 100;
    this.failedImgY = 200;
    this.failedImgWidth = 160;
    this.failedImgHeight = 120;
    this.failedImgSrc = "nyan-whale.gif";
}

$(function () {
    window.conf = new Config();
    window.manager = new Manager();
    //$.cookie('highest_score', 0);
    manager.start();
});