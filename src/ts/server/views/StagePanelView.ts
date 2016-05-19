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

    //left
    leftAvatarCtn:any;
    rightAvatarCtn:any;
    eloLabelArr:any;

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

        //update player
        {
            $(".inputPanel").show();
            $(".btnUpdate").click((e)=> {
                var s = $(e.target).data("pos").toString();
                var pos = parseInt(s);
                var playerId = $($(".playerId")[pos]).val();
                console.log($(e.target).data("pos"), playerId);

                $.post("/getPlayerInfo/" + playerId, null, function (res) {
                    var data = JSON.parse(res);
                    cmd.proxy(CommandId.cs_updatePlayer, {playerInfo: data.playerInfo, pos: pos});
                    $($(".playerAvatar")[pos]).attr("src", data.playerInfo.avatar);
                });
            });
        }


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
        cmd.on(CommandId.updatePlayer, (param)=> {
            var pos = param.pos;
            var playerData = param.playerInfo;
            this.setPlayer(pos, playerData);
        });

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
        var blink = 80;
        for (var i = 0; i < this.leftCircleArr.length; i++) {
            if (i < leftScore) {
                if (this.leftCircleArr[i].alpha == 0)
                    createjs.Tween.get(this.leftCircleArr[i])
                        .to({alpha: 1}, blink)
                        .to({alpha: 0}, blink)
                        .to({alpha: 1}, blink)
                        .to({alpha: 0}, blink)
                        .to({alpha: 1}, blink);
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
        var blink = 80;

        this.rightScoreLabel.text = rightScore + "";
        var len = this.rightCircleArr.length;
        for (var i = 0; i < len; i++) {
            if (i < rightScore) {
                if (this.rightCircleArr[len - 1 - i].alpha == 0)
                    createjs.Tween.get(this.rightCircleArr[len - 1 - i])
                        .to({alpha: 1}, blink)
                        .to({alpha: 0}, blink)
                        .to({alpha: 1}, blink)
                        .to({alpha: 0}, blink)
                        .to({alpha: 1}, blink);
                // createjs.Tween.get(this.rightCircleArr[len - 1 - i]).to({alpha: 1}, 200);
            }
            else {
                createjs.Tween.get(this.rightCircleArr[len - 1 - i]).to({alpha: 0}, 200);
            }
        }
    }

    setPlayer(pos, playerData:PlayerInfo) {
        var playerInfo = new PlayerInfo(playerData);
        console.log("updatePlayer", pos, playerInfo);
        this.eloLabelArr[pos].text = playerInfo.eloScore();
    }

    setCtnXY(param) {
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
        var stageWidth = 1920;
        var stageHeight = 1080;
        var ctn = this.ctn;

        this.fxCtn = new createjs.Container();
        // this.stage.scaleX = 0.5;
        // this.stage.scaleY = 0.5;
        // this.ctn.scaleX = 0.5;
        // this.ctn.scaleY = 0.5;
        var ctnMove = this.fxCtn;
        this.stage.addChild(ctn);
        this.ctn.addChild(ctnMove);


        var bg = new createjs.Bitmap("/img/panel/stagescore.png");
        bg.x = (stageWidth - 658) * .5;
        bg.y = stageHeight - 107;
        ctnMove.addChild(bg);

        {//score point

            //left score---------------------
            this.leftCircleArr = [];
            this.rightCircleArr = [];
            var px = 205 + 470;
            var py = stageHeight - 43;
            for (var i = 0; i < 7; i++) {
                var leftScoreBg = new createjs.Bitmap("/img/panel/leftScoreBg.png");//694x132
                leftScoreBg.x = px + i * 20;
                leftScoreBg.y = py;
                ctnMove.addChild(leftScoreBg);
                var leftScore = new createjs.Bitmap("/img/panel/leftScore.png");//694x132
                leftScore.x = leftScoreBg.x;
                leftScore.y = leftScoreBg.y;
                ctnMove.addChild(leftScore);
                this.leftCircleArr.push(leftScore);
            }
            //right score
            px = 1090;
            for (var i = 0; i < 7; i++) {
                var rightScoreBg = new createjs.Bitmap("/img/panel/rightScoreBg.png");//694x132
                rightScoreBg.x = px + i * 20;
                rightScoreBg.y = py;
                ctnMove.addChild(rightScoreBg);
                var rightScore = new createjs.Bitmap("/img/panel/rightScore.png");//694x132
                rightScore.x = rightScoreBg.x;
                rightScore.y = rightScoreBg.y;
                ctnMove.addChild(rightScore);
                this.rightCircleArr.push(rightScore);
            }


            var sheet = new createjs.SpriteSheet({
                animations: {
                    "0": 1,
                    "1": 2,
                    "2": 3,
                    "3": 4,
                    "4": 5,
                    "5": 6,
                    "6": 7,
                    "7": 8,
                    "8": 9,
                    "9": 0
                },
                images: ["/img/panel/scoreNum.png"],
                frames: [[0, 0, 40, 54],
                    [41, 0, 40, 54],
                    [0, 55, 40, 54],
                    [41, 55, 40, 54],
                    [82, 0, 40, 54],
                    [82, 55, 40, 54],
                    [123, 0, 40, 54],
                    [123, 55, 40, 54],
                    [0, 110, 40, 54],
                    [41, 110, 40, 54]]
            });
            var leftScoreNum = new createjs.BitmapText("0", sheet);
            leftScoreNum.letterSpacing = -2;
            leftScoreNum.x = bg.x + 230;
            leftScoreNum.y = bg.y + 37;
            this.leftScoreLabel = leftScoreNum;
            ctnMove.addChild(leftScoreNum);

            var rightScoreNum = new createjs.BitmapText("0", sheet);
            rightScoreNum.letterSpacing = -2;
            rightScoreNum.x = bg.x + 390;
            rightScoreNum.y = leftScoreNum.y;
            this.rightScoreLabel = rightScoreNum;
            ctnMove.addChild(rightScoreNum);
        }

        {///time label---------------------------------------------------
            var timeLabel = new createjs.Text("99:99", "28px Arial", "#e2e2e2");
            timeLabel.x = stageWidth * .5 - 32;
            timeLabel.y = stageHeight - 30;

            this.timeLabel = timeLabel;
            ctnMove.addChild(timeLabel);
        }

        {//left right player
            this.eloLabelArr = [];
            var leftOfs = 5;
            var bgLeft = new createjs.Bitmap("/img/panel/stageleft.png");//694x132
            bgLeft.x = leftOfs;
            bgLeft.y = stageHeight - 132;
            ctnMove.addChild(bgLeft);

            for (var i = 0; i < 4; i++) {
                var leftAvatarBg = new createjs.Bitmap("/img/panel/leftAvatarBg.png");//694x132
                leftAvatarBg.x = bgLeft.x + 15 + i * 150;
                leftAvatarBg.y = bgLeft.y + 6;
                ctnMove.addChild(leftAvatarBg);

                // var leftAvatarMask = new createjs.Shape();
                // // var leftMask =  new createjs.Bitmap("/img/panel/leftAvatarMask.png");//694x132
                //
                // leftAvatarMask.graphics.beginBitmapFill(img)
                //     .drawRect(0, 0, 217, 124);
                // leftAvatarMask.graphics.beginFill("#ccc")
                //     .drawRect(0,0,100,100);
                //
                // leftAvatarMask.x = bgLeft.x + 15 + i * 150;
                // leftAvatarMask.y = bgLeft.y + 6;
                // leftAvatarBg.mask = leftAvatarMask;
                // ctnMove.addChild(leftAvatarMask);


                // ctnMove.addChild(leftMask);

                var leftEloBg = new createjs.Bitmap("/img/panel/leftEloBg.png");//694x132
                leftEloBg.x = leftAvatarBg.x + 25;
                leftEloBg.y = bgLeft.y + 70;
                ctnMove.addChild(leftEloBg);

                var leftEloLabel = new createjs.Text("1984", "18px Arial", "#e2e2e2");
                leftEloLabel.textAlign = "left";
                leftEloLabel.x = leftEloBg.x + 12;
                leftEloLabel.y = leftEloBg.y;
                this.eloLabelArr.push(leftEloLabel);
                ctnMove.addChild(leftEloLabel);

                var leftStyleIcon = new createjs.Bitmap("/img/panel/feng.png");//694x132
                leftStyleIcon.x = leftAvatarBg.x + 120;
                leftStyleIcon.y = leftAvatarBg.y + 80;
                ctnMove.addChild(leftStyleIcon);

                var leftNameLabel = new createjs.Text("斯蒂芬库里", "bold 18px Arial", "#e2e2e2");
                leftNameLabel.textAlign = "left";
                leftNameLabel.x = leftAvatarBg.x + 20;
                leftNameLabel.y = leftAvatarBg.y + 90;
                ctnMove.addChild(leftNameLabel);
            }
            // };

            var bgRight = new createjs.Bitmap("/img/panel/stageright.png");//694x132
            bgRight.x = stageWidth - 694 - leftOfs;
            bgRight.y = bgLeft.y;
            ctnMove.addChild(bgRight);
            for (var i = 0; i < 4; i++) {
                var rightAvatarBg = new createjs.Bitmap("/img/panel/rightAvatarBg.png");//694x132
                rightAvatarBg.x = bgRight.x + 14 + i * 150;
                rightAvatarBg.y = bgRight.y + 6;
                ctnMove.addChild(rightAvatarBg);

                var rightEloBg = new createjs.Bitmap("/img/panel/rightEloBg.png");//694x132
                rightEloBg.x = rightAvatarBg.x + 125;
                rightEloBg.y = bgRight.y + 70;
                ctnMove.addChild(rightEloBg);

                var rightEloLabel = new createjs.Text("99999", "18px Arial", "#e2e2e2");
                rightEloLabel.textAlign = "right";
                rightEloLabel.x = rightEloBg.x + 53;
                rightEloLabel.y = rightEloBg.y;
                this.eloLabelArr.push(rightEloLabel);
                ctnMove.addChild(rightEloLabel);


                var rightStyleIcon = new createjs.Bitmap("/img/panel/huo.png");//694x132
                rightStyleIcon.x = rightAvatarBg.x + 60;
                rightStyleIcon.y = rightAvatarBg.y + 80;
                ctnMove.addChild(rightStyleIcon);

                var rightNameLabel = new createjs.Text("斯蒂芬库里", "bold 18px Arial", "#e2e2e2");
                rightNameLabel.textAlign = "right";
                rightNameLabel.x = rightAvatarBg.x + 195;
                rightNameLabel.y = rightAvatarBg.y + 90;
                ctnMove.addChild(rightNameLabel);
            }
        }

        {/// event panel------------------------------------------------------
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
        }

        //op panel-------------------------------------------------------
        if (this.isOp) {
            this.initOp();
        }
        if (param) {
            this.setLeftScore(param.leftScore);
            this.setRightScore(param.rightScore);
            this.setTime(param.time, param.state);
            for (var i = 0; i < param.playerInfoArr.length; i++) {
                var obj = param.playerInfoArr[i];
                if (obj) {
                    this.setPlayer(obj.pos, obj);
                }
            }
            if (param.ctnXY)
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