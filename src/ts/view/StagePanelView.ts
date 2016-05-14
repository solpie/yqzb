/// <reference path="BaseView.ts"/>

class TopPanelView extends BaseView {
    time:number;
    timerId:number;

    constructor(stage, isClient) {
        super(stage, isClient);

        this.init();
    }

    init() {
        var bg = new createjs.Bitmap(this.path("img/panelTop.png"));
        bg.x = 150;
        bg.y = 5;
        this.stage.addChild(bg);
        //left
        var leftScore = 0;
        var rightScore = 0;
        var px = 205;
        var py = 40;
        var circleArr = [];
        var circleRArr = [];
        for (var i = 0; i < 5; i++) {
            var spCircle = new createjs.Shape();
            spCircle.graphics.beginFill("#7f745b");
            spCircle.graphics.drawCircle(px + i * 50, py, 15);
            spCircle.graphics.beginFill("#4b4b4b");
            spCircle.graphics.drawCircle(px + i * 50, py, 12);
            if (!this.isClient) {
                spCircle.addEventListener("click", function () {
                    cmd.emit(CommandId.addLeftScore);
                });
            }
            this.stage.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#ffff00");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            this.stage.addChild(circleHide);
            if (!this.isClient) {
                circleHide.addEventListener("click", function () {
                    cmd.emit(CommandId.addLeftScore);
                });
            }
            circleHide.alpha = 0;
            circleArr.push(circleHide)
        }
        //right
        px = 700;
        for (var i = 0; i < 5; i++) {
            var spCircle = new createjs.Shape();
            spCircle.graphics.beginFill("#7f745b");
            spCircle.graphics.drawCircle(px + i * 50, py, 15);
            spCircle.graphics.beginFill("#4b4b4b");
            spCircle.graphics.drawCircle(px + i * 50, py, 12);
            if (!this.isClient) {
                spCircle.addEventListener("click", function () {
                    cmd.emit(CommandId.addRightScore);
                });
            }
            this.stage.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#0c83fc");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            if (!this.isClient) {
                circleHide.addEventListener("click", function () {
                    cmd.emit(CommandId.addRightScore);
                });
            }
            this.stage.addChild(circleHide);
            circleHide.alpha = 0;
            circleRArr.push(circleHide)
        }

        var leftScoreLabel = new createjs.Text("0", "30px Arial", "#a2a2a2");
        leftScoreLabel.x = 490;
        leftScoreLabel.y = 30;
        var rightScoreLabel = new createjs.Text("0", "30px Arial", "#a2a2a2");
        rightScoreLabel.x = 600;
        rightScoreLabel.y = 30;
        this.stage.addChild(leftScoreLabel);
        this.stage.addChild(rightScoreLabel);

        cmd.on(CommandId.addLeftScore, ()=> {
            leftScore++;
            if (leftScore > 5) {
                leftScore = 0;
            }

            leftScoreLabel.text = leftScore + "";
            for (var i = 0; i < 5; i++) {
                if (i < leftScore) {
                    createjs.Tween.get(circleArr[i]).to({alpha: 1}, 200);
                    //circleArr[i].alpha = 1;
                }
                else {
                    createjs.Tween.get(circleArr[i]).to({alpha: 0}, 200);
                    //circleArr[i].alpha = 0;
                }
            }
            console.log(leftScore);
        });

        cmd.on(CommandId.addRightScore, ()=> {
            rightScore++;
            if (rightScore > 5) {
                rightScore = 0;
            }
            rightScoreLabel.text = rightScore + "";
            for (var i = 0; i < 5; i++) {
                if (i < rightScore) {
                    createjs.Tween.get(circleRArr[5 - 1 - i]).to({alpha: 1}, 200);
                }
                else {
                    createjs.Tween.get(circleRArr[5 - 1 - i]).to({alpha: 0}, 200);
                }
            }
        });

        ///time label---------------------------------------------------
        var time = 0;
        var timeLabel = new createjs.Text("99:99", "30px Arial", "#a2a2a2");
        timeLabel.x = 520;
        timeLabel.y = 90;
        var isRunning = false;
        cmd.on(CommandId.toggleTimer, ()=> {
            if (isRunning) {
                clearInterval(this.timerId);
                // $("#btnToggleTime").val("开始");
                isRunning = false;
            }
            else {
                this.timerId = setInterval(()=> {
                    time++;
                    timeLabel.text = this.formatSecond(time);
                }, 1000);
                // $("#btnToggleTime").val("暂停");
                isRunning = true;
            }
        });
        cmd.on(CommandId.resetTimer, ()=> {
            //$("#btnResetTime").on(MouseEvt.CLICK, ()=> {
            time = 0;
            timeLabel.text = this.formatSecond(time);
        });

        this.stage.addChild(timeLabel);
    }


    formatSecond(sec) {
        var min = Math.floor(sec / 60);
        var s = sec % 60;
        var strMin = min + "";
        var strSec = s + "";
        if (min < 10)
            strMin = "0" + strMin;
        if (s < 10)
            strSec = "0" + strSec;
        return strMin + ":" + strSec;
    }
}