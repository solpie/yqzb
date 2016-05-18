/// <reference path="../../view/BaseView.ts"/>

class StagePanelView extends BaseView {
    // time:number = 0;
    timerId:number;
    leftCircleArr:any;
    rightCircleArr:any;
    leftScoreLabel:any;
    rightScoreLabel:any;
    curSelectCtn:any;
    // time = 0;
    timeLabel:any;
    ctn:any;
    fxCtn:any;
    eventCtn:any;
    fxEventCtn:any;

    constructor(stage, isOp) {
        super(stage, isOp);
        // if (!this.isClient)
        //     this.init(null);

        this.handle();
    }

    initOp() {
        super.initOp();
        var ctn = this.ctn;
        var fxCtn = this.fxCtn;

        var btnMove = this.newBtn(()=> {
            this.curSelectCtn = ctn;
            // this.moveCtnIdx = 0;
        }, "moveStage");
        fxCtn.addChild(btnMove);

        var btnMove = this.newBtn(()=> {
            this.curSelectCtn = this.eventCtn;
            // this.moveCtnIdx = 1;
        }, "moveEvent");
        btnMove.y = 50;
        fxCtn.addChild(btnMove);

        var btnLeft = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_addLeftScore);
        });
        btnLeft.x = 450;
        btnLeft.y = 5;
        btnLeft.alpha = .5;
        fxCtn.addChild(btnLeft);

        var btnRight = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_addRightScore);
        });
        btnRight.x = 590;
        btnRight.y = 5;
        btnRight.alpha = .5;
        fxCtn.addChild(btnRight);
        var btn = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_toggleTimer);
        }, "toggle");
        btn.x = 450;
        btn.y = 100;
        btn.alpha = .5;
        fxCtn.addChild(btn);
        var btn = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_resetTimer);
        }, "reset");
        btn.x = 590;
        btn.y = 100;
        btn.alpha = .5;
        fxCtn.addChild(btn);

        var btn = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_fadeOut);
        }, "fadeOut");
        btn.x = 520;
        btn.y = 200;
        // btn.alpha = .5;
        fxCtn.addChild(btn);

        var btn = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_stageFadeIn);
        }, "fadeIn");
        btn.x = 520;
        btn.y = 150;
        // btn.alpha = .5;
        fxCtn.addChild(btn);

        var btn = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_playerScore);
        }, "score");
        btn.x = 820;
        btn.y = 150;
        // btn.alpha = .5;
        fxCtn.addChild(btn);

        //key
        document.onkeydown = (e)=> {
            var key = e.keyCode;
            var isCtrl = e.ctrlKey;
            var isShift = e.shiftKey;
            var isAlt = e.altKey;
            console.log("key:", key);

            if (key == 38)//up
            {
                this.curSelectCtn.y -= 1;
            }
            else if (key == 40)//down
            {
                this.curSelectCtn.y += 1;

            }
            else if (key == 37)//left
            {
                this.curSelectCtn.x -= 1;

            }
            else if (key == 39)//right
            {
                this.curSelectCtn.x += 1;
            }
            cmd.proxy(CommandId.cs_moveStagePanel,
                {
                    ctnX: this.ctn.x,
                    ctnY: this.ctn.y,
                    eventX: this.eventCtn.x,
                    eventY: this.eventCtn.y,
                });
        };
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
            createjs.Tween.get(this.fxCtn).to({y: -100, alpha: .2}, 200);
        });

        cmd.on(CommandId.stageFadeIn, ()=> {
            createjs.Tween.get(this.fxCtn).to({y: 0, alpha: 1}, 200);
        });

        cmd.on(CommandId.moveStagePanel, (param)=> {
            this.setCtnXY(param);
        });

        var isBusy = false;
        cmd.on(CommandId.playerScore, ()=> {
            if (!isBusy) {
                isBusy = true;
                createjs.Tween.get(this.fxEventCtn)
                    .to({x: 1080, alpha: 1}, 100)
                    .wait(3000)
                    .to({y: 150, alpha: 0}, 200)
                    .call(()=> {
                        this.fxEventCtn.x = 800;
                        this.fxEventCtn.y = 200;
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

    setCtnXY(param){
        this.ctn.x = param.ctnX;
        this.ctn.y = param.ctnY;
        this.eventCtn.x = param.eventX;
        this.eventCtn.y = param.eventY;
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
        var ctn = this.ctn;
        this.fxCtn = new createjs.Container();

        var ctnMove = this.fxCtn;
        this.stage.addChild(ctn);

        this.ctn.addChild(ctnMove);

        var bg = new createjs.Bitmap("/img/panelTop.png");
        bg.x = 150;
        ctnMove.addChild(bg);
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
            ctnMove.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#ffff00");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            ctnMove.addChild(circleHide);
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
            ctnMove.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#0c83fc");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            ctnMove.addChild(circleHide);
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
        ctnMove.addChild(leftScoreLabel);
        ctnMove.addChild(rightScoreLabel);


        ///time label---------------------------------------------------
        var timeLabel = new createjs.Text("99:99", "30px Arial", "#a2a2a2");
        timeLabel.x = 520;
        timeLabel.y = 90;

        this.timeLabel = timeLabel;
        ctnMove.addChild(timeLabel);
        /// score panel------------------------------------------------------
        this.fxEventCtn = new createjs.Container();
        this.eventCtn = new createjs.Container();
        // var bg1 = new createjs.Shape();
        // bg1.graphics.beginFill("#105386");
        // bg1.graphics.drawRect(0, 0, 200, 70);
        // // bg1.graphics.beginLinearGradientFill(['#105386',''])
        // bg1.graphics.beginFill("#ffff00");
        // bg1.graphics.drawRect(128, 3, 64, 64);
        // bg1.alpha = .7;

        var box = new createjs.Shape();
        box.graphics.beginLinearGradientFill(["rgba(11, 80, 125, 0)", "#105386"], [0, .7], 0, 0, 200, 0);
        // box.graphics.beginLinearGradientFill(["rgba(255, 0, 0, 0)","#105386" ], [0, .7], 0, 0, 200, 0);
        box.graphics.drawRect(0, 0, 200, 70);
        box.graphics.endFill();
        box.graphics.beginFill("#ffff00");
        box.graphics.drawRect(128, 3, 64, 64);
        box.cache(0, 0, 200, 70);
        box.alpha = .8;
        this.fxEventCtn.addChild(box);
        // this.fxEventCtn.addChild(bg1);

        var avatar = new createjs.Bitmap("/img/player/p1.png");
        avatar.x = 130;
        avatar.y = 5;
        this.fxEventCtn.addChild(avatar);
        this.fxEventCtn.alpha = 0;
        this.fxEventCtn.x = 800;
        this.fxEventCtn.y = 200;
        avatar.addEventListener('click', ()=> {
            console.log("click score");
        });
        this.eventCtn.addChild(this.fxEventCtn);
        ctnMove.addChild(this.eventCtn);

        //op panel-------------------------------------------------------
        if (this.isOp) {
            this.initOp();
        }
        if (param) {
            this.setLeftScore(param.leftScore);
            this.setRightScore(param.rightScore);
            this.setTime(param.time, param.state);
            if(param.ctnXY)
                this.setCtnXY(param.ctnXY);
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