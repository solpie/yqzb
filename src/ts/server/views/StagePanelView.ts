/// <reference path="../../view/BaseView.ts"/>

class StagePanelView extends BaseView {
    // time:number = 0;
    timerId:number;
    leftCircleArr:any;
    rightCircleArr:any;
    leftScoreLabel:any;
    rightScoreLabel:any;
    // time = 0;

    timeLabel:any;
    ctn:any;
    scoreCtn:any;

    constructor(stage, isOp) {
        super(stage, isOp);
        // if (!this.isClient)
        //     this.init(null);

        this.handle();
    }

    handle() {
        console.log("handle()");
        cmd.on(CommandId.addLeftScore, (leftScore)=> {
            console.log("handle left score");
            this.setLeftScore(leftScore)
        });

        cmd.on(CommandId.addRightScore, (rightScore)=> {
            this.setRightScore(rightScore);
        });

        cmd.on(CommandId.toggleTimer, ()=> {
            if (this.timerId) {
                clearInterval(this.timerId);
                this.timerId = 0;
                appInfo.panel.stage.timerState = 0;
            }
            else {
                this.timerId = setInterval(()=> {
                    appInfo.panel.stage.time++;
                    this.timeLabel.text = this.formatSecond(appInfo.panel.stage.time);
                }, 1000);
                appInfo.panel.stage.timerState = 1;
            }
        });
        cmd.on(CommandId.resetTimer, ()=> {
            //$("#btnResetTime").on(MouseEvt.CLICK, ()=> {
            appInfo.panel.stage.time = 0;
            this.timeLabel.text = this.formatSecond(appInfo.panel.stage.time);
        });

        cmd.on(CommandId.stageFadeOut, ()=> {
            createjs.Tween.get(this.ctn).to({y: -100, alpha: .2}, 200);
        });

        cmd.on(CommandId.stageFadeIn, ()=> {
            createjs.Tween.get(this.ctn).to({y: 0, alpha: 1}, 200);
        });
        var isBusy = false;
        cmd.on(CommandId.playerScore, ()=> {
            if (!isBusy) {
                isBusy = true;
                createjs.Tween.get(this.scoreCtn)
                    .to({x: 1080, alpha: 1}, 100)
                    .wait(3000)
                    .to({y: 150, alpha: 0}, 200)
                    .call(()=> {
                        this.scoreCtn.x = 800;
                        this.scoreCtn.y = 200;
                        isBusy = false;
                    });
            }
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
        appInfo.panel.stage.time = time;
        if (state) {
            cmd.emit(CommandId.toggleTimer);
        }
    }

    init(param) {
        super.init(param);
        var ctn = new createjs.Container();
        this.ctn = ctn;
        this.stage.addChild(ctn);

        var bg = new createjs.Bitmap("/img/panelTop.png");
        bg.x = 150;
        ctn.addChild(bg);
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
            ctn.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#ffff00");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            ctn.addChild(circleHide);
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
            ctn.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#0c83fc");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            ctn.addChild(circleHide);
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
        ctn.addChild(leftScoreLabel);
        ctn.addChild(rightScoreLabel);


        ///time label---------------------------------------------------
        var timeLabel = new createjs.Text("99:99", "30px Arial", "#a2a2a2");
        timeLabel.x = 520;
        timeLabel.y = 90;

        this.timeLabel = timeLabel;
        ctn.addChild(timeLabel);
        /// score panel------------------------------------------------------
        this.scoreCtn = new createjs.Container();
        // var bg1 = new createjs.Shape();
        // bg1.graphics.beginFill("#105386");
        // bg1.graphics.drawRect(0, 0, 200, 70);
        // // bg1.graphics.beginLinearGradientFill(['#105386',''])
        // bg1.graphics.beginFill("#ffff00");
        // bg1.graphics.drawRect(128, 3, 64, 64);
        // bg1.alpha = .7;

        var box = new createjs.Shape();
        box.graphics.beginLinearGradientFill(["rgba(11, 80, 125, 0)","#105386" ], [0, .7], 0, 0, 200, 0);
        // box.graphics.beginLinearGradientFill(["rgba(255, 0, 0, 0)","#105386" ], [0, .7], 0, 0, 200, 0);
        box.graphics.drawRect(0, 0, 200, 70);
        box.graphics.endFill();
        box.graphics.beginFill("#ffff00");
        box.graphics.drawRect(128, 3, 64, 64);
        box.cache(0, 0, 200, 70);
        box.alpha = .8;
        this.scoreCtn.addChild(box);
        // this.scoreCtn.addChild(bg1);

        var avatar = new createjs.Bitmap("/img/player/p1.png");
        avatar.x = 130;
        avatar.y = 5;
        this.scoreCtn.addChild(avatar);
        this.scoreCtn.alpha = 0;
        this.scoreCtn.x = 800;
        this.scoreCtn.y = 200;
        avatar.addEventListener('click', ()=> {
            console.log("click score");
        });
        ctn.addChild(this.scoreCtn);
        //op panel-------------------------------------------------------
        if (this.isOp) {
            var btnLeft = this.newBtn(()=> {
                cmd.proxy(CommandId.cs_addLeftScore);

            });
            btnLeft.x = 450;
            btnLeft.y = 5;
            btnLeft.alpha = .5;
            ctn.addChild(btnLeft);

            var btnRight = this.newBtn(()=> {
                cmd.proxy(CommandId.cs_addRightScore);
            });
            btnRight.x = 590;
            btnRight.y = 5;
            btnRight.alpha = .5;
            ctn.addChild(btnRight);
            var btn = this.newBtn(()=> {
                cmd.proxy(CommandId.cs_toggleTimer);
            }, "toggle");
            btn.x = 450;
            btn.y = 100;
            btn.alpha = .5;
            ctn.addChild(btn);
            var btn = this.newBtn(()=> {
                cmd.proxy(CommandId.cs_resetTimer);
            }, "reset");
            btn.x = 590;
            btn.y = 100;
            btn.alpha = .5;
            ctn.addChild(btn);

            var btn = this.newBtn(()=> {
                cmd.proxy(CommandId.cs_fadeOut);
            }, "fadeOut");
            btn.x = 520;
            btn.y = 200;
            // btn.alpha = .5;
            ctn.addChild(btn);

            var btn = this.newBtn(()=> {
                cmd.proxy(CommandId.cs_stageFadeIn);
            }, "fadeIn");
            btn.x = 520;
            btn.y = 150;
            // btn.alpha = .5;
            ctn.addChild(btn);

            var btn = this.newBtn(()=> {
                cmd.proxy(CommandId.cs_playerScore);
            }, "score");
            btn.x = 820;
            btn.y = 150;
            // btn.alpha = .5;
            ctn.addChild(btn);
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