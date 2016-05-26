/// <reference path="../clientDef.ts"/>
declare var cmd:{
    on(val:number, func:any);
    proxy(val:number, param?:any);
};
declare var client:any;
class StagePanel2 {
    mvpPos:any;
    isBusy = false;
    straight3Ctn;

    constructor() {
        var mvpArr = $(".playerMvp");
        mvpArr[0].checked = true;
        mvpArr.change((e)=> {
            this.mvpPos = $(e.target).data("pos");
            console.log("on mvp change");
            $("#txtMvpPos").html(this.mvpPos);
        });

        $("#btnShowWin").click(function () {
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
        this.onServer();
        this.onInit();
    }

    onServer() {
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
    }

    sendNotice() {
        var txt = $('#notice').val();
        cmd.proxy(CommandId.cs_notice, {notice: txt})
    }

    fadeInNoticePanel(imgData) {
        var stagePanelCtn = client.panel.ctn;
        stagePanelCtn.alpha = 0;
        var noticePanelView = client.panel.noticePanelView;
        var ctn = noticePanelView.getCtn();
        ctn.x = (1920 - 1070) * .5;
        ctn.y = 1080 - 130;
        ctn.alpha = 0;
        noticePanelView.fadeInNotice(imgData);
        var noticeImg = noticePanelView.noticeImg;
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

    onInit() {
        //        console.log(client.panel.stage);
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
        var stagePanel = client.panel;
        var ctn = stagePanel.winCtn;
        createjs.Tween.get(ctn).to({alpha: 0}, 200)
            .call(function () {
                ctn.alpha = 1;
                ctn.removeAllChildren();
            });
    }

    fadeInWinPanel(paramDataArr, mvp) {
        console.log(this, "show fadeInWinPanel mvp:", mvp);

        var stagePanel = client.panel;
        var ctn = stagePanel.winCtn;

        var bg = new createjs.Shape();
        bg.graphics.beginFill('#000').drawRect(0, 0, client.panel.stageWidth, client.panel.stageHeight);
        bg.alpha = .3;
        ctn.addChild(bg);

        var playerCtn = new createjs.Container();
        ctn.addChild(playerCtn);

        //        var playerInfoArr = stagePanel.playerInfoArr;
        if (this.verifyWin(stagePanel.playerInfoArr, mvp)) {
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
            titleCtn.x = (stagePanel.stageWidth) * .5;
            titleCtn.y = 198;
            titleCtn.scaleX = titleCtn.scaleY = 5;
            titleCtn.alpha = 0;
            createjs.Tween.get(titleCtn).to({scaleX: 1, scaleY: 1, alpha: 1}, 150);
            titleCtn.addChild(title);
            ctn.addChild(titleCtn);
            console.log(title.getBounds());

            var prePlayerIsMvp = false;
            playerCtn.x = (stagePanel.stageWidth - 4 * 390) * .5;
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
}


var stagePanel2;
$(function main() {
    stagePanel2 = new StagePanel2();
});




