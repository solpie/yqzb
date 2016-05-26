/// <reference path="../clientDef.ts"/>
/// <reference path="./NoticePanelView.ts"/>
/// <reference path="./BaseView2.ts"/>
declare var cmd:{
    on(val:number, func:any);
    proxy(val:number, param?:any);
    emit(val:number, param?:any);
};
declare var client:any;
class StagePanel2 extends BaseView2 {
    mvpPos:any = 0;
    isBusy = false;
    straight3Ctn;
    timeOnSec:number = 0;
    timerState:number = 0;
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

    //playerInfo array
    playerInfoArr:any = new Array(8);
    eloLabelArr:any;
    nameLabelArr:any;
    avatarArr:any;
    styleArr:any;

    //
    winCtn:any;
    noticePanelView:any;
    leftAvgEloScoreLabel:any;
    rightAvgEloScoreLabel:any;

    constructor() {
        super();
        this.onServerBroadcast();

        var mvpArr = $(".playerMvp");
        mvpArr[0].checked = true;
        mvpArr.change((e)=> {
            this.mvpPos = $(e.target).data("pos");
            console.log("on mvp change");
            $("#txtMvpPos").html(this.mvpPos);
        });

        $("#btnShowWin").click(() => {
            console.log("mvp is:", this.mvpPos);
            cmd.proxy(CommandId.cs_fadeInWinPanel, {
                mvp: this.mvpPos
            });
        });

        $("#btnHideWin").click(function () {
            cmd.proxy(CommandId.cs_fadeOutWinPanel);
        });
        $("#btnSaveGame").click(function () {
            cmd.proxy(CommandId.cs_saveGameRec);
        });
        $("#notice").keyup((e)=> {
            if (e.keyCode == 13 && e.ctrlKey) {
                console.log("send notice");
                this.sendNotice();
            }
        });
        $('#btnNotice').click(()=> {
            this.sendNotice();
        });
    }


    sendNotice() {
        var txt = $('#notice').val();
        cmd.proxy(CommandId.cs_notice, {notice: txt})
    }

    fadeInNoticePanel(imgData) {
        var stagePanelCtn = client.panel.ctn;
        stagePanelCtn.alpha = 0;
        // var noticePanelView = client.panel.noticePanelView;
        var ctn = this.noticePanelView.getCtn();
        ctn.x = (1920 - 1070) * .5;
        ctn.y = 1080 - 130;
        ctn.alpha = 0;
        this.noticePanelView.fadeInNotice(imgData);
        var noticeImg = this.noticePanelView.noticeImg;
        noticeImg.x = 800;
        var noticeImgWidth = noticeImg.getBounds().width;
        var showSec = noticeImgWidth / 100 * 1000;

        function fadeOutNotice() {
            createjs.Tween.get(ctn)
                .wait(500)
                .to({alpha: 0}, 200)
                .call(function () {
                    stagePanelCtn.alpha = 1;
                });
        }

        createjs.Tween.get(ctn)
            .to({alpha: 1}, 200)
            .call(function () {
                createjs.Tween.get(noticeImg)
                    .to({x: -noticeImgWidth}, showSec)
                    .call(fadeOutNotice);
            });
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

    onInit(param) {
        this.stage = client.panel.stage;
        var stageWidth = 1920;
        var stageHeight = 1080;
        var ctn = this.ctn = client.panel.ctn;

        this.fxCtn = new createjs.Container();
        var ctnMove = this.fxCtn;
        this.stage.addChild(ctn);
        this.ctn.addChild(ctnMove);

        this.winCtn = new createjs.Container();
        this.stage.addChild(this.winCtn);

        this.noticePanelView = new NoticePanelView(this.stage);

        var bg = new createjs.Bitmap("/img/panel/stageScoreBg.png");
        bg.x = (stageWidth - 658) * .5;
        bg.y = stageHeight - 118;
        ctnMove.addChild(bg);

        var lTxt = new createjs.Text("", "28px Arial", "#fff");
        lTxt.textAlign = 'center';
        lTxt.x = bg.x + 137;
        lTxt.y = bg.y + 7;
        this.leftAvgEloScoreLabel = lTxt;
        ctnMove.addChild(lTxt);

        var rTxt = new createjs.Text("", "28px Arial", "#fff");
        rTxt.textAlign = 'center';
        rTxt.x = bg.x + 522;
        rTxt.y = lTxt.y;
        this.rightAvgEloScoreLabel = rTxt;
        ctnMove.addChild(rTxt);

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
            leftScoreNum.y = bg.y + 48;
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
            this.nameLabelArr = [];
            this.avatarArr = [];
            this.styleArr = [];
            var leftOfs = 5;
            var bgLeft = new createjs.Bitmap("/img/panel/stageleft.png");//694x132
            bgLeft.x = leftOfs;
            bgLeft.y = stageHeight - 132;
            ctnMove.addChild(bgLeft);

            for (var i = 0; i < 4; i++) {

                // PlayerView.getLeftStagePlayerCard();
                var leftAvatarBg = new createjs.Bitmap("/img/panel/leftAvatarBg.png");//694x132
                leftAvatarBg.x = bgLeft.x + 15 + i * 150;
                leftAvatarBg.y = bgLeft.y + 6;

                var avatarCtn = new createjs.Container();
                avatarCtn.x = leftAvatarBg.x + 25;
                avatarCtn.y = leftAvatarBg.y + 9;
                var leftMask = new createjs.Shape();
                var sx = 44;
                leftMask.graphics.beginFill("#000000")
                    .moveTo(sx, 0)
                    .lineTo(0, 76)
                    .lineTo(180 - sx, 76)
                    .lineTo(180, 0)
                    .lineTo(sx, 0);
                var avatarBmp = new createjs.Bitmap("/img/player/p11.png");
                avatarBmp.mask = leftMask;
                avatarCtn.addChild(leftMask);
                avatarCtn.addChild(avatarBmp);
                this.avatarArr.push(avatarCtn);
                ctnMove.addChild(avatarCtn);
                ctnMove.addChild(leftAvatarBg);

                var leftEloBg = new createjs.Bitmap("/img/panel/leftEloBg.png");//694x132
                leftEloBg.x = leftAvatarBg.x + 27;
                leftEloBg.y = bgLeft.y + 70;
                ctnMove.addChild(leftEloBg);

                var leftEloLabel = new createjs.Text("1984", "18px Arial", "#e2e2e2");
                leftEloLabel.textAlign = "left";
                leftEloLabel.x = leftEloBg.x + 12;
                leftEloLabel.y = leftEloBg.y + 3;
                this.eloLabelArr.push(leftEloLabel);
                ctnMove.addChild(leftEloLabel);


                var styleCtn = new createjs.Container();
                var leftStyleIcon = new createjs.Bitmap("/img/panel/feng.png");//694x132
                styleCtn.x = leftAvatarBg.x + 120;
                styleCtn.y = leftAvatarBg.y + 80;
                styleCtn.addChild(leftStyleIcon);
                this.styleArr.push(styleCtn);
                ctnMove.addChild(styleCtn);

                var leftNameLabel = new createjs.Text("player", "bold 18px Arial", "#e2e2e2");
                leftNameLabel.textAlign = "left";
                leftNameLabel.x = leftAvatarBg.x + 20;
                leftNameLabel.y = leftAvatarBg.y + 90;
                this.nameLabelArr.push(leftNameLabel);
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

                var rightAvatarCtn = new createjs.Container();
                rightAvatarCtn.x = rightAvatarBg.x + 11;
                rightAvatarCtn.y = rightAvatarBg.y + 9;
                var rightMask = new createjs.Shape();
                var sx = 44;
                rightMask.graphics.beginFill("#000000")
                    .moveTo(0, 0)
                    .lineTo(sx, 76)
                    .lineTo(180, 76)
                    .lineTo(180 - sx, 0)
                    .lineTo(0, 0);
                var avatarBmp = new createjs.Bitmap("/img/player/p13.png");
                avatarBmp.mask = rightMask;
                rightAvatarCtn.addChild(rightMask);
                rightAvatarCtn.addChild(avatarBmp);
                this.avatarArr.push(rightAvatarCtn);
                ctnMove.addChild(rightAvatarCtn);
                ctnMove.addChild(rightAvatarBg);

                var rightEloBg = new createjs.Bitmap("/img/panel/rightEloBg.png");//694x132
                rightEloBg.x = rightAvatarBg.x + 125;
                rightEloBg.y = bgRight.y + 70;
                ctnMove.addChild(rightEloBg);

                var rightEloLabel = new createjs.Text("99999", "18px Arial", "#e2e2e2");
                rightEloLabel.textAlign = "right";
                rightEloLabel.x = rightEloBg.x + 53;
                rightEloLabel.y = rightEloBg.y + 3;
                this.eloLabelArr.push(rightEloLabel);
                ctnMove.addChild(rightEloLabel);


                var styleCtn = new createjs.Container();
                var rightStyleIcon = new createjs.Bitmap("/img/panel/huo.png");//694x132
                styleCtn.x = rightAvatarBg.x + 60;
                styleCtn.y = rightAvatarBg.y + 80;
                this.styleArr.push(styleCtn);
                styleCtn.addChild(rightStyleIcon);
                ctnMove.addChild(styleCtn);

                var rightNameLabel = new createjs.Text("player", "bold 18px Arial", "#e2e2e2");
                rightNameLabel.textAlign = "right";
                rightNameLabel.x = rightAvatarBg.x + 195;
                rightNameLabel.y = rightAvatarBg.y + 90;
                this.nameLabelArr.push(rightNameLabel);
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

            var avatar = new createjs.Bitmap("/img/player/p11.png");
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
        if (client.panel.isOp) {
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

    verifyWin(playerInfoArr, mvp):Boolean {
        for (var i = 0; i < playerInfoArr.length; i++) {
            var playerInfo = playerInfoArr[i];
            if (!playerInfo)
                return false;
            playerInfo.isMvp = (i == mvp);
        }
        return true;
    }

    fadeOutWinPanel() {
        console.log(this, "show fade Out WinPanel");
        var ctn = this.winCtn;
        createjs.Tween.get(ctn).to({alpha: 0}, 200)
            .call(function () {
                ctn.alpha = 1;
                ctn.removeAllChildren();
            });
    }

    fadeInWinPanel(paramDataArr, mvp) {
        console.log(this, "show fadeInWinPanel mvp:", mvp);

        var ctn = this.winCtn;

        var bg = new createjs.Shape();
        bg.graphics.beginFill('#000').drawRect(0, 0, client.panel.stageWidth, client.panel.stageHeight);
        bg.alpha = .3;
        ctn.addChild(bg);

        var playerCtn = new createjs.Container();
        ctn.addChild(playerCtn);

        if (this.verifyWin(this.playerInfoArr, mvp)) {
            var isRedWin = (mvp > 3);

            var titlePath = "/img/panel/winPanelTitle";
            if (isRedWin)
                titlePath += 'Red.png';
            else
                titlePath += 'Blue.png';
            var titleCtn = new createjs.Container();

            var title = new createjs.Bitmap(titlePath);
            title.x = -419;//838 315
            title.y = -158;
            titleCtn.x = (this.stageWidth) * .5;
            titleCtn.y = 198;
            titleCtn.scaleX = titleCtn.scaleY = 5;
            titleCtn.alpha = 0;
            createjs.Tween.get(titleCtn).to({scaleX: 1, scaleY: 1, alpha: 1}, 150);
            titleCtn.addChild(title);
            ctn.addChild(titleCtn);
            console.log(title.getBounds());

            var prePlayerIsMvp = false;
            playerCtn.x = (this.stageWidth - 4 * 390) * .5;
            playerCtn.y = 300;
            for (var i = 0; i < 4; i++) {
                var pInfo;
                pInfo = new PlayerInfo(paramDataArr[i].playerData);
                pInfo.isRed = paramDataArr[i].playerData.isRed;
                pInfo.isMvp = paramDataArr[i].playerData.pos == mvp;
                var playerCard = this.getWinPlayerCard(pInfo);
                playerCard.x = i * 390;
                if (pInfo.isMvp)
                    playerCard.y = -30;
                else
                    playerCard.y = 0;
                var bound = playerCard.getBounds();
                playerCard.cache(bound.x, bound.y, bound.width, bound.height);
                console.log("new player card", paramDataArr[i], playerCard.x, playerCard.y, this.mvpPos);
                playerCard.px = playerCard.x;
                playerCard.py = playerCard.y;
                playerCard.x = 500;
                playerCard.scaleX = playerCard.scaleY = 0.01;
                createjs.Tween.get(playerCard)
                    .to({x: playerCard.px, scaleX: 1.1, scaleY: 1.1}, 200)
                    .to({scaleX: 1, scaleY: 1}, 60);
                playerCtn.addChild(playerCard);
                prePlayerIsMvp = pInfo.isMvp;
            }
        }
        else {
            alert("球员数据不完整！");
        }
    }

    fadeInStraight3() {
        if (!this.isBusy) {
            this.isBusy = true;
            var ctn;
            if (!this.straight3Ctn) {
                ctn = new createjs.Container();
                var txt3 = new createjs.Text("三杀！！！", "bold 40px Arial", "#e2e2e2");
                txt3.x = -txt3.getBounds().width;
                txt3.y = -txt3.getBounds().height;
                ctn.addChild(txt3);
                ctn.x = 1920 / 2;
                ctn.y = 100;
                ctn.cache(txt3.x, txt3.y, txt3.getBounds().width, txt3.getBounds().height);
                client.panel.stage.addChild(ctn);
                this.straight3Ctn = ctn;
            }
            else
                ctn = this.straight3Ctn;

            ctn.alpha = 1;
            ctn.scaleX = ctn.scaleY = 5;

            createjs.Tween.get(ctn)
                .to({scaleX: 1, scaleY: 1}, 150)
                .wait(3000)
                .to({alpha: 0}, 200).call(()=> {
                this.isBusy = false;
            });


            //            createjs.Tween.get(client.panel.fxEventCtn)
            //                    .to({x: 1080, alpha: 1}, 100)
            //                    .wait(3000)
            //                    .to({y: 150, alpha: 0}, 200)
            //                    .call(function () {
            //                        client.panel.fxEventCtn.x = 800;
            //                        client.panel.fxEventCtn.y = 200;
            //                        isBusy = false;
            //                    });
        }
    }

    getWinPlayerCard(p):any {
        var isMvp = p.isMvp;
        var ctn = new createjs.Container();
        var avatar = new createjs.Bitmap(p.avatar());
        console.log("playerCard=======:", p.avatar());
        if (isMvp) {
            avatar.scaleX = avatar.scaleY = 1.5;
            avatar.x = (180 - 180 * 1.2) * .5 + 60;
            avatar.y = 45 + 30;
        }
        else {
            avatar.scaleX = avatar.scaleY = 1.2;
            avatar.x = (180 - 180 * 1.2) * .5 + 60;
            avatar.y = 50 + 30;
        }
        ctn.addChild(avatar);

        var bgPath = '/img/panel/playerBgWin';
        if (p.isRed)
            bgPath += "Red";
        else
            bgPath += "Blue";
        if (p.isMvp)
            bgPath += "Mvp";
        bgPath += '.png';
        var bg = new createjs.Bitmap(bgPath);
        if (p.isMvp) {
            bg.x = -132;
            bg.y = -105;
        }
        else {
            bg.x = -116;
            bg.y = -110 + 30;
        }
        ctn.addChild(bg);


        var col;
        if (p.isRed)
            col = "#e23f6b";
        else
            col = "#1ac3fa";

        var nameCol = "#ddd";
        if (isMvp)
            nameCol = "#f1c236";
        var name;
        if (isMvp)
            name = new createjs.Text(p.name(), "30px Arial", nameCol);
        else
            name = new createjs.Text(p.name(), "30px Arial", col);
        name.textAlign = 'center';
        name.x = 90 + 60;
        if (isMvp)
            name.x += 20;
        name.y = 185 + 30;
        ctn.addChild(name);

        var eloScore;
        eloScore = new createjs.Text(p.eloScore(), "bold 32px Arial", nameCol);
        eloScore.textAlign = 'center';
        eloScore.x = name.x;
        eloScore.y = 245 + 30;
        if (isMvp)
            eloScore.y += 30;
        ctn.addChild(eloScore);

        var eloScoreDt = new createjs.Text("+" + p.dtScore(), "12px Arial", col);
        eloScoreDt.textAlign = 'left';
        eloScoreDt.x = 140 + 60;
        eloScoreDt.y = 260 + 30;
        if (isMvp) {
            eloScoreDt.x += 30;

            eloScoreDt.y += 30;
        }
        ctn.addChild(eloScoreDt);

        var winpercent = new createjs.Text("胜率" + p.winpercent().toFixed(3) * 100 + "%", "18px Arial", col);
        winpercent.textAlign = 'center';
        winpercent.x = name.x;
        winpercent.y = 320;
        if (isMvp)
            winpercent.y += 35;
        ctn.addChild(winpercent);

        var gameCount = new createjs.Text("总场数" + p.gameCount(), "18px Arial", col);
        gameCount.textAlign = 'center';
        gameCount.x = name.x;
        gameCount.y = 350;
        if (isMvp)
            gameCount.y += 35;
        ctn.addChild(gameCount);

        var style = new createjs.Bitmap(p.getWinStyleIcon());
        style.x = 110;
        style.y = 370;
        if (isMvp) {
            style.x += 20;
            style.y += 45;
        }
        ctn.addChild(style);
        return ctn;
    }


    // constructor(stage, isOp) {
    //     super(stage, isOp);
    // }

    initOp() {
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

            $(".btnQuery").click((e)=> {
                var s = $(e.target).data("pos").toString();
                var pos = parseInt(s);
                var playerId = $($(".playerId")[pos]).val();
                console.log($(e.target).data("pos"), playerId);

                $.post("/getPlayerInfo/" + playerId, null, function (res) {
                    var data = JSON.parse(res);
                    $($(".playerAvatar")[pos]).attr("src", data.playerInfo.avatar);
                });
            });

            $("#btnUpdateAll").click((e)=> {
                var playerIdArr = [];
                for (var i = 0; i < 8; i++) {
                    var pos = i;
                    var playerId = $($(".playerId")[pos]).val();
                    if (playerId) {
                        playerIdArr.push({playerId: playerId, pos: pos})
                    }
                }
                if (playerIdArr.length)
                    cmd.proxy(CommandId.cs_updatePlayerAll, playerIdArr);
            })
        }


        var btnMove = this.newBtn(()=> {
            if (this.curSelectCtn)
                this.curSelectCtn = null;
            else
                this.curSelectCtn = ctn;
        }, "moveStage");
        fxCtn.addChild(btnMove);

        var btnMove = this.newBtn(()=> {
            if (this.curSelectCtn)
                this.curSelectCtn = null;
            else
                this.curSelectCtn = this.eventCtn;
        }, "moveEvent");
        btnMove.y = 100;
        fxCtn.addChild(btnMove);

        var btnLeft = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_addLeftScore);
        }, "addLeft");
        btnLeft.x = 20;
        btnLeft.y = 500;
        fxCtn.addChild(btnLeft);

        var btnRight = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_addRightScore);
        }, 'addRight');
        btnRight.x = 850;
        btnRight.y = 500;
        fxCtn.addChild(btnRight);

        var btn = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_toggleTimer);
        }, "toggle");
        btn.x = 200;
        btn.y = 300;
        fxCtn.addChild(btn);
        var btn = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_resetTimer);
        }, "reset");
        btn.x = 590;
        btn.y = 300;
        fxCtn.addChild(btn);

        var btn = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_fadeOut);
        }, "fadeOut");
        btn.x = 520;
        btn.y = 200;
        fxCtn.addChild(btn);

        var btn = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_stageFadeIn);
        }, "fadeIn");
        btn.x = 520;
        btn.y = 100;
        fxCtn.addChild(btn);

        var btn = this.newBtn(()=> {
            cmd.proxy(CommandId.cs_playerScore);
        }, "score");
        btn.x = 820;
        btn.y = 150;
        fxCtn.addChild(btn);

        //key
        document.onkeydown = (e)=> {
            var key = e.keyCode;
            var isCtrl = e.ctrlKey;
            var isShift = e.shiftKey;
            var isAlt = e.altKey;
            var isMove = false;
            if (key == 38)//up
            {
                this.curSelectCtn.y -= 1;
                isMove = true;
            }
            else if (key == 40)//down
            {
                this.curSelectCtn.y += 1;
                isMove = true;
            }
            else if (key == 37)//left
            {
                this.curSelectCtn.x -= 1;
                isMove = true;
            }
            else if (key == 39)//right
            {
                this.curSelectCtn.x += 1;
                isMove = true;
            }
            if (isMove)
                cmd.proxy(CommandId.cs_moveStagePanel,
                    {
                        ctnX: this.ctn.x,
                        ctnY: this.ctn.y,
                        eventX: this.eventCtn.x,
                        eventY: this.eventCtn.y,
                    });
        };
    }

    onServerBroadcast() {
        cmd.on(CommandId.initPanel, (param) => {
            console.log("initPanel::::::::", param);
            this.onInit(param)
        });

        cmd.on(CommandId.fadeInWinPanel, (param)=> {
            this.fadeInWinPanel(param.playerDataArr, param.mvp);
        });
        cmd.on(CommandId.fadeOutWinPanel, (param)=> {
            console.log("hide win panel", param);
            this.fadeOutWinPanel();
        });
        cmd.on(CommandId.straightScore3, (param)=> {
            console.log("straight score 3", param);
            this.fadeInStraight3();
        });
        cmd.on(CommandId.straightScore5, (param)=> {
            console.log("straight score 5", param);
        });
        cmd.on(CommandId.notice, (param) => {
            var notice = param.notice;
            this.fadeInNoticePanel(param.img);
            console.log('on notice ', notice);
        });

        cmd.on(CommandId.updatePlayer, (param)=> {
            var pos = param.pos;
            var playerData = param.playerInfo;
            this.setPlayer(pos, playerData);
        });
        cmd.on(CommandId.updatePlayerAll, (playerDataArr)=> {
            var tweenCall = (dt, pos, playerData)=> {
                createjs.Tween.get(this).wait(dt).call(()=> {
                    this.setPlayer(pos, playerData);
                });
            };
            for (var i = 0; i < playerDataArr.length; i++) {
                var playerData = playerDataArr[i];
                var pos = playerData.pos;
                tweenCall(i * 300, pos, playerData);
            }
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
                this.timerState = 0;
            }
            else {
                this.timerId = setInterval(()=> {
                    this.timeOnSec++;
                    this.timeLabel.text = this.formatSecond(this.timeOnSec);
                }, 1000);
                this.timerState = 1;
            }
        });

        cmd.on(CommandId.resetTimer, ()=> {
            this.timeOnSec = 0;
            this.timeLabel.text = this.formatSecond(this.timeOnSec);
        });

        cmd.on(CommandId.stageFadeOut, ()=> {
            createjs.Tween.get(this.fxCtn).to({y: 140, alpha: .2}, 200);
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
        var len = this.leftCircleArr.length;

        for (var i = 0; i < this.leftCircleArr.length; i++) {
            if (i < leftScore) {
                if (this.leftCircleArr[len - 1 - i].alpha == 0)
                    this.blink(this.leftCircleArr[len - 1 - i]);
                //circleArr[i].alpha = 1;
            }
            else {
                createjs.Tween.get(this.leftCircleArr[len - 1 - i]).to({alpha: 0}, 200);
                //circleArr[i].alpha = 0;
            }
        }
        console.log(leftScore);
    }

    blink(target) {
        var blink = 80;
        createjs.Tween.get(target)
            .to({alpha: 1}, blink)
            .to({alpha: 0}, blink)
            .to({alpha: 1}, blink)
            .to({alpha: 0}, blink)
            .to({alpha: 1}, blink);
    }

    setRightScore(rightScore) {
        this.rightScoreLabel.text = rightScore + "";
        var len = this.rightCircleArr.length;
        for (var i = 0; i < len; i++) {
            if (i < rightScore) {
                if (this.rightCircleArr[i].alpha == 0)
                    this.blink(this.rightCircleArr[i]);
                // createjs.Tween.get(this.rightCircleArr[len - 1 - i]).to({alpha: 1}, 200);
            }
            else {
                createjs.Tween.get(this.rightCircleArr[i]).to({alpha: 0}, 200);
            }
        }
    }

    //计算队伍天梯平均分
    setAvgEloScore() {
        function getAvgRight(start, playerInfoArr) {
            var sum = 0;
            var count = 0;
            for (var i = start; i < start + 4; i++) {
                var playerInfo:PlayerInfo = playerInfoArr[i];
                if (playerInfo) {
                    count++;
                    sum += playerInfo.eloScore();
                }
            }
            var ret = Math.floor(sum / count);
            return ret?ret:0;
        }

        this.leftAvgEloScoreLabel.text = getAvgRight(0, this.playerInfoArr) + "";
        this.rightAvgEloScoreLabel.text = getAvgRight(4, this.playerInfoArr) + "";
    }

    setPlayer(pos, playerData) {
        var playerInfo = new PlayerInfo(playerData);
        playerInfo.isRed = playerData.isRed;
        playerInfo.isMvp = playerData.isMvp;
        playerInfo.pos = playerData.pos;

        this.playerInfoArr[pos] = playerInfo;
        console.log("updatePlayer", pos, playerInfo, this.eloLabelArr.length);
        this.eloLabelArr[pos].text = playerInfo.eloScore();
        this.nameLabelArr[pos].text = playerInfo.name();

        var styleCtn = this.styleArr[pos];
        styleCtn.removeAllChildren();
        var styleIcon = new createjs.Bitmap(playerInfo.getStyleIcon());
        styleIcon.alpha = 0;
        styleCtn.addChild(styleIcon);
        this.blink(styleIcon);

        var avatarCtn = this.avatarArr[pos];
        avatarCtn.removeChildAt(1);
        var mask = avatarCtn.getChildAt(0);


        var avatar = new createjs.Bitmap(playerInfo.avatar());
        avatarCtn.addChild(avatar);
        avatar.mask = mask;
        var img = new Image();
        img.onload = function () {
            avatar.scaleX = avatar.scaleY = 180 / this.width;
        };
        img.src = playerInfo.avatar();

        this.setAvgEloScore();
    }

    setCtnXY(param) {
        this.ctn.x = param.ctnX;
        this.ctn.y = param.ctnY;
        this.eventCtn.x = param.eventX;
        this.eventCtn.y = param.eventY;
    }

    setTime(time, state:number) {
        this.timeLabel.text = this.formatSecond(time);
        this.timeOnSec = time;
        if (state) {
            cmd.emit(CommandId.toggleTimer);
        }
    }
}


var stagePanel2;
$(function main() {
    stagePanel2 = new StagePanel2();
});




