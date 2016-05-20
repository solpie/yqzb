/// <reference path="../../view/BaseView.ts"/>

class WinPanelView extends BaseView {
    playerCtn:any;

    init(param) {
        super.init(param);
        var ctn = this.ctn;


        var bg = new createjs.Shape();
        bg.graphics.beginFill('#000').drawRect(0, 0, this.stageWidth, this.stageHeight);
        bg.alpha = .3;
        ctn.addChild(bg);

        var playerCtn = new createjs.Container();
        // playerCtn.x = (1920 - 4 * 390) * .5;
        // playerCtn.y = (this.stage.height - 690) * .5;
        ctn.addChild(playerCtn);
        this.playerCtn = playerCtn;

        var playerArr = [];

        var playerInfo = new PlayerInfo();
        playerInfo.name("tmac");
        playerInfo.avatar("/img/player/p1.png");
        playerInfo.eloScore(2431);
        playerInfo.style(1);
        playerInfo.winpercent(.9501);
        playerArr.push(playerInfo);

        var playerInfo = new PlayerInfo();
        playerInfo.name("tmac");
        playerInfo.avatar("/img/player/p2.png");
        playerInfo.eloScore(2431);
        playerInfo.style(2);
        playerInfo.winpercent(.9501);
        playerArr.push(playerInfo);
        playerInfo.isMvp = true;

        var playerInfo = new PlayerInfo();
        playerInfo.name("tmac");
        playerInfo.avatar("/img/player/p3.png");
        playerInfo.eloScore(2431);
        playerInfo.style(3);
        playerInfo.winpercent(.9501);
        playerArr.push(playerInfo);

        var playerInfo = new PlayerInfo();
        playerInfo.name("tmac");
        playerInfo.avatar("/img/player/p4.png");
        playerInfo.eloScore(2431);
        playerInfo.style(4);
        playerInfo.winpercent(.9501);
        playerArr.push(playerInfo);

        // var px = 60;
        // var py = 30;
        // var prePlayerIsMvp = false;
        // for (var i = 0; i < playerArr.length; i++) {
        //     var pInfo = playerArr[i];
        //     var playerView1 = new PlayerView();
        //     var playerView = playerView1.getWinPlayerCard(pInfo);
        //     playerView.x = px + i * 390;
        //     if (pInfo.isMvp)
        //         playerView.y = py - 30;
        //     else
        //         playerView.y = py;
        //     playerCtn.addChild(playerView);
        //     prePlayerIsMvp = pInfo.isMvp;
        // }
        this.setPlayerInfoArr(playerArr);

        this.stage.addChild(ctn);
        playerCtn.x = 360;
        playerCtn.y = (this.stage.height - 690) * .5;

        //===============
        if (this.isOp)
            this.initOp();
    }

    setPlayerInfoArr(playerInfoArr) {
        // this.ctn.removeAllChildren()
        this.playerCtn.removeAllChildren();
        var px = 60;
        var py = 30;
        var prePlayerIsMvp = false;
        for (var i = 0; i < playerInfoArr.length; i++) {
            var pInfo = playerInfoArr[i];
            var playerView1 = new PlayerView();
            var playerView = playerView1.getWinPlayerCard(pInfo);
            playerView.x = px + i * 390;
            if (pInfo.isMvp)
                playerView.y = py - 30;
            else
                playerView.y = py;
            this.playerCtn.addChild(playerView);
            prePlayerIsMvp = pInfo.isMvp;
        }
    }

    show() {
        this.ctn.show();
    }

    hide() {
        this.ctn.hide();
    }

    fadeIn() {

    }

    fadeOut() {

    }

    initOp() {
        super.initOp();
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
                cmd.proxy(CommandId.cs_updatePlayerAllWin, playerIdArr);
        });
    }

    onServerBroadcast() {
        cmd.on(CommandId.updatePlayerAllWin, (playerInfoArr)=> {
            this.setPlayerInfoArr(playerInfoArr);
        });

    }

    renderChangeData() {

    }
}