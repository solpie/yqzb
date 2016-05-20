/// <reference path="../../view/BaseView.ts"/>

class WinPanelView extends BaseView {
    playerCtn:any;
    mvpPos:number = 0;
    isRed:boolean = true;

    init(param) {
        super.init(param);
        var ctn = this.ctn;
        var bg = new createjs.Shape();
        bg.graphics.beginFill('#000').drawRect(0, 0, this.stageWidth, this.stageHeight);
        bg.alpha = .3;
        ctn.addChild(bg);

        var playerCtn = new createjs.Container();
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
        playerInfo.avatar("/img/player/p1.png");
        playerInfo.eloScore(2431);
        playerInfo.style(2);
        playerInfo.winpercent(.9501);
        playerArr.push(playerInfo);
        playerInfo.isMvp = true;

        var playerInfo = new PlayerInfo();
        playerInfo.name("tmac");
        playerInfo.avatar("/img/player/p1.png");
        playerInfo.eloScore(2431);
        playerInfo.style(3);
        playerInfo.winpercent(.9501);
        playerArr.push(playerInfo);

        var playerInfo = new PlayerInfo();
        playerInfo.name("tmac");
        playerInfo.avatar("/img/player/p1.png");
        playerInfo.eloScore(2431);
        playerInfo.style(4);
        playerInfo.winpercent(.9501);
        playerArr.push(playerInfo);

        this.setPlayerInfoArr(playerArr, false);

        this.stage.addChild(ctn);


        //===============
        if (this.isOp)
            this.initOp();

        this.onServerBroadcast();

        if (param) {
            this.setPlayerInfoArr(param.playerInfoArr, true);
        }
    }

    setPlayerInfoArr(playerInfoArr, isPlayerData) {
        // this.ctn.removeAllChildren()
        this.playerCtn.removeAllChildren();
        var px = 60;
        var py = 30;
        var prePlayerIsMvp = false;

        playerInfoArr.sort(sortCompare('pos'));
        for (var i = 0; i < playerInfoArr.length; i++) {
            var pInfo;
            if (isPlayerData) {
                pInfo = new PlayerInfo(playerInfoArr[i]);
                pInfo.isMvp = playerInfoArr[i].isMvp;
                pInfo.isRed = playerInfoArr[i].isRed;
            }
            else
                pInfo = playerInfoArr[i];
            // pInfo.isMvp = (pInfo.pos == mvpPos);
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

        this.playerCtn.x = (this.stageWidth - 390 * 4) * .5;
        this.playerCtn.y = (this.stageHeight - 690) * .5;
    }

    show() {
        this.ctn.show();
    }

    hide() {
        this.ctn.hide();
    }

    fadeIn() {
        for (var i = 0; i < 4; i++) {
            var playerCard = this.playerCtn.getChildAt(i);
            createjs.Tween.get(playerCard)
                .to({scaleX: 1, scaleY: 1}, 300, createjs.Ease.bounceInOut);
        }
    }

    fadeOut() {
        for (var i = 0; i < 4; i++) {
            var playerCard = this.playerCtn.getChildAt(i);
            createjs.Tween.get(playerCard)
                .to({x: 500, scaleX: 0.01, scaleY: 0.01}, 100, createjs.Ease.bounceInOut);
        }
    }

    initOp() {
        super.initOp();
        $("#btnFadeOut").click((e)=> {
            this.fadeOut();
        });

        $("#btnFadeIn").click((e)=> {
            this.fadeIn();
        });

        $("#btnUpdateAll").click((e)=> {
            var playerIdArr = [];
            for (var i = 0; i < 4; i++) {
                var pos = i;
                var playerId = $($(".playerId")[pos]).val();
                if (playerId) {
                    playerIdArr.push({playerId: playerId, pos: pos})
                }
            }
            if (playerIdArr.length)
                cmd.proxy(CommandId.cs_updatePlayerAllWin, {playerIdArr: playerIdArr, mvp: this.mvpPos, isRed: this.isRed});
        });
        var mvpArr = $(".playerMvp");
        mvpArr[0].checked = true;
        mvpArr.change((e)=> {
            this.mvpPos = parseInt($(e.target).data("pos").toString());
        });


        var isRedArr = $(".isRed");
        isRedArr[0].checked = true;
        isRedArr.change((e)=> {
            this.isRed = ($(e.target).data("pos").toString() == "1");
        });
    }

    onServerBroadcast() {
        cmd.on(CommandId.updatePlayerAllWin, (playerInfoArr)=> {
            this.setPlayerInfoArr(playerInfoArr, true);
        });

    }

    renderChangeData() {

    }
}