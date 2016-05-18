/// <reference path="../../view/BaseView.ts"/>

class WinPanelView extends BaseView {
    // constructor(){
    //     super()
    // }
    init(param) {
        super.init(param);
        var ctn = this.ctn;

        var bg = new createjs.Shape();
        bg.graphics.beginFill("#ccc").drawRoundRect(0, 0, 600, 350, 10);
        ctn.addChild(bg);
        var playerArr = [];

        var playerInfo = new PlayerInfo();
        playerInfo.name("tmac");
        playerInfo.avatar("/img/player/p1.png");
        playerInfo.eloScore(2431);
        playerInfo.style(2);
        playerInfo.winpercent(.9501);
        playerArr.push(playerInfo);
        // var playerInfo = new PlayerInfo();
        // playerInfo.name = "curry";
        // playerInfo.avatar = "/img/player/p2.png";
        // playerInfo.eloScore = 2143;
        // playerInfo.style = 1;
        // playerInfo.winpercent = 15/42;
        // playerArr.push(playerInfo);
        // var playerInfo = new PlayerInfo();
        // playerInfo.name = "harden";
        // playerInfo.avatar = "/img/player/p3.png";
        // playerInfo.eloScore = 2431;
        // playerInfo.style = 4;
        // playerInfo.winpercent = .9501;
        // playerArr.push(playerInfo);
        // var playerInfo = new PlayerInfo();
        // playerInfo.name = "westbrook";
        // playerInfo.avatar = "/img/player/p4.png";
        // playerInfo.eloScore = 2143;
        // playerInfo.style = 3;
        // playerInfo.winpercent = 15/42;
        // playerArr.push(playerInfo);

        var px = 60;
        var py = 30;
        for (var i = 0; i < playerArr.length; i++) {
            var pInfo = playerArr[i];
            var playerView = PlayerView.getPlayerCard(pInfo);
            playerView.x = px+i*120;
            playerView.y = py;
            var winpercent = new createjs.Text(pInfo.getWinPercent() + '', "24px Arial", "#a2a2a2");
            winpercent.y = 120;
            playerView.addChild(winpercent);
            ctn.addChild(playerView);
        }

        this.stage.addChild(ctn);
    }

    renderChangeData() {
        
    }
}