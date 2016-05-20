/// <reference path="../../view/BaseView.ts"/>

class WinPanelView extends BaseView {
    init(param) {
        super.init(param);
        var ctn = this.ctn;

        var playerCtn = new createjs.Container();
        playerCtn.x = (1920 - 4 * 390) * .5;
        playerCtn.y = (this.stage.height - 690) * .5;
        ctn.addChild(playerCtn);


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

        var px = 60;
        var py = 30;
        var prePlayerIsMvp = false;
        for (var i = 0; i < playerArr.length; i++) {
            var pInfo = playerArr[i];
            var playerView = PlayerView.getWinPlayerCard(pInfo);
            playerView.x = px + i * 390;
            if (pInfo.isMvp)
                playerView.y = py - 30;
            else
                playerView.y = py;
            playerCtn.addChild(playerView);
            prePlayerIsMvp = pInfo.isMvp;
        }

        this.stage.addChild(ctn);
        playerCtn.x = 360;
        playerCtn.y = (this.stage.height - 690) * .5;
    }

    onServerBroadcast() {

    }

    renderChangeData() {

    }
}