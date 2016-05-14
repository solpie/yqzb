/// <reference path="BaseView.ts"/>

class TopPanelView extends BaseView {
    time:number = 0;
    timerId:number;
    leftCircleArr:any;
    rightCircleArr:any;
    leftScoreLabel:any;
    rightScoreLabel:any;
    // time = 0;

    timeLabel:any;

    constructor(stage, isClient) {
        super(stage, isClient);
        if (!this.isClient)
            this.init(null);

        this.handle();
    }

    handle() {
        cmd.on(CommandId.addLeftScore, (leftScore)=> {
            this.setLeftScore(leftScore)
        });

        cmd.on(CommandId.addRightScore, (rightScore)=> {
            this.setRightScore(rightScore);
        });
    }

    setLeftScore(leftScore) {
        this.leftScoreLabel.text = leftScore + "";
        for (var i = 0; i < 5; i++) {
            if (i < leftScore) {
                createjs.Tween.get(this.leftCircleArr[i]).to({alpha: 1}, 200);
                //circleArr[i].alpha = 1;
            }
            else {
                createjs.Tween.get(this.leftCircleArr[i]).to({alpha: 0}, 200);
                //circleArr[i].alpha = 0;
            }
        }
        console.log(leftScore);
    }

    setRightScore(rightScore) {
        this.rightScoreLabel.text = rightScore + "";
        for (var i = 0; i < 5; i++) {
            if (i < rightScore) {
                createjs.Tween.get(this.rightCircleArr[5 - 1 - i]).to({alpha: 1}, 200);
            }
            else {
                createjs.Tween.get(this.rightCircleArr[5 - 1 - i]).to({alpha: 0}, 200);
            }
        }
    }

    setTime(time, state) {
        this.timeLabel.text = this.formatSecond(time);
        if (state) {
            this.timerId = setInterval(()=> {
                this.time++;
                this.timeLabel.text = this.formatSecond(time);
            }, 1000);
        }
    }

    init(param) {
        var container = new createjs.Container();

        this.stage.addChild(container);

        var bg = new createjs.Bitmap(this.path("img/panelTop.png"));
        bg.x = 150;
        container.addChild(bg);
        //left
        this.leftCircleArr = [];
        this.rightCircleArr = [];
        var px = 205;
        var py = 40;
        for (var i = 0; i < 5; i++) {
            var spCircle = new createjs.Shape();
            spCircle.graphics.beginFill("#7f745b");
            spCircle.graphics.drawCircle(px + i * 50, py, 15);
            spCircle.graphics.beginFill("#4b4b4b");
            spCircle.graphics.drawCircle(px + i * 50, py, 12);
            container.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#ffff00");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            container.addChild(circleHide);
            circleHide.alpha = 0;
            this.leftCircleArr.push(circleHide)
        }
        //right
        px = 700;
        for (var i = 0; i < 5; i++) {
            var spCircle = new createjs.Shape();
            spCircle.graphics.beginFill("#7f745b");
            spCircle.graphics.drawCircle(px + i * 50, py, 15);
            spCircle.graphics.beginFill("#4b4b4b");
            spCircle.graphics.drawCircle(px + i * 50, py, 12);
            container.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#0c83fc");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            container.addChild(circleHide);
            circleHide.alpha = 0;
            this.rightCircleArr.push(circleHide)
        }

        var leftScoreLabel = new createjs.Text("0", "30px Arial", "#a2a2a2");
        leftScoreLabel.x = 490;
        leftScoreLabel.y = 30;
        this.leftScoreLabel = leftScoreLabel;
        var rightScoreLabel = new createjs.Text("0", "30px Arial", "#a2a2a2");
        rightScoreLabel.x = 600;
        rightScoreLabel.y = 30;
        this.rightScoreLabel = rightScoreLabel;
        container.addChild(leftScoreLabel);
        container.addChild(rightScoreLabel);


        ///time label---------------------------------------------------
        var timeLabel = new createjs.Text("99:99", "30px Arial", "#a2a2a2");
        timeLabel.x = 520;
        timeLabel.y = 90;
        cmd.on(CommandId.toggleTimer, ()=> {
            if (this.timerId) {
                clearInterval(this.timerId);
                this.timerId = 0
            }
            else {
                this.timerId = setInterval(()=> {
                    this.time++;
                    timeLabel.text = this.formatSecond(this.time);
                }, 1000);
            }
        });
        cmd.on(CommandId.resetTimer, ()=> {
            //$("#btnResetTime").on(MouseEvt.CLICK, ()=> {
            this.time = 0;
            timeLabel.text = this.formatSecond(this.time);
        });
        this.timeLabel = timeLabel;
        container.addChild(timeLabel);
        if (!this.isClient) {
            var btnLeft = this.newBtn(()=> {
                appInfo.panelInfo.stagePanelInfo.addLeftScore();
            });
            btnLeft.x = 450;
            btnLeft.y = 5;
            container.addChild(btnLeft);

            var btnLeft = this.newBtn(()=> {
                appInfo.panelInfo.stagePanelInfo.addRightScore();
            });
            btnLeft.x = 650;
            btnLeft.y = 5;
            container.addChild(btnLeft);
        }
        if (param) {
            this.setLeftScore(param.leftScore);
            this.setRightScore(param.rightScore);
            this.setTime(param.time, param.state);
        }
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