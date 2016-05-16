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

        var playerInfo = new PlayerInfo();
        playerInfo.name = "tmac";
        playerInfo.avatar = "/img/player/p1.png";
        playerInfo.eloScore = 2431;
        playerInfo.style = 3;

        var playerView = PlayerView.getPlayerCard(playerInfo);
        playerView.x = 15;
        playerView.y = 30;
        ctn.addChild(playerView);

        var playerInfo = new PlayerInfo();
        playerInfo.name = "curry";
        playerInfo.avatar = "/img/player/p2.png";
        playerInfo.eloScore = 2143;
        playerInfo.style = 1;

        var playerView = PlayerView.getPlayerCard(playerInfo);
        playerView.x = 115;
        playerView.y = 30;
        ctn.addChild(playerView);

        this.stage.addChild(ctn);
    }

    renderChangeData() {
        
    }
}