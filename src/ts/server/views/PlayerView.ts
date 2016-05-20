class PlayerView {
    nameLabel:any;
    


    constructor() {

    }

    setPlayerInfo(playerInfo:PlayerInfo) {

    };

    getWinPlayerCard(p:PlayerInfo) {
        var isMvp = p.isMvp;
        var ctn = new createjs.Container();
        var avatar = new createjs.Bitmap(p.avatar());
        if (isMvp) {
            avatar.scaleX = avatar.scaleY = 1.5;
            avatar.x = (180 - 180 * 1.2) * .5;
            avatar.y = 45;
        }
        else {
            avatar.scaleX = avatar.scaleY = 1.2;
            avatar.x = (180 - 180 * 1.2) * .5;
            avatar.y = 50;
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
            bg.x = -192;
            bg.y = -135;
        }
        else {
            bg.x = -176;
            bg.y = -110;
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
        name.x = 90;
        if (isMvp)
            name.x += 20;
        name.y = 185;
        ctn.addChild(name);
        this.nameLabel = name;

        var eloScore;
        eloScore = new createjs.Text(p.eloScore(), "bold 32px Arial", nameCol);
        eloScore.textAlign = 'center';
        eloScore.x = name.x;
        eloScore.y = 245;
        if (isMvp)
            eloScore.y += 30;
        ctn.addChild(eloScore);

        var eloScoreDt = new createjs.Text("+" + p.eloScore(), "12px Arial", col);
        eloScoreDt.textAlign = 'left';
        eloScoreDt.x = 140;
        eloScoreDt.y = 260;
        if (isMvp) {
            eloScoreDt.x += 30;

            eloScoreDt.y += 30;
        }
        ctn.addChild(eloScoreDt);

        var winpercent = new createjs.Text("胜率" + p.winpercent().toFixed(3) * 100 + "%", "18px Arial", col);
        winpercent.textAlign = 'center';
        winpercent.x = name.x;
        winpercent.y = 290;
        if (isMvp)
            winpercent.y += 35;
        ctn.addChild(winpercent);

        var gameCount = new createjs.Text("总场数" + p.gameCount(), "18px Arial", col);
        gameCount.textAlign = 'center';
        gameCount.x = name.x;
        gameCount.y = 320;
        if (isMvp)
            gameCount.y += 35;
        ctn.addChild(gameCount);

        var style = new createjs.Bitmap(p.getWinStyleIcon());
        style.x = 50;
        style.y = 340;
        if (isMvp) {
            style.x += 20;
            style.y += 45;
        }
        ctn.addChild(style);

        return ctn;
    }

    static getPlayerCard(p:PlayerInfo) {
        var ctn = new createjs.Container();
        var bg = new createjs.Shape();
        bg.graphics.beginBitmapFill('#cccc').drawRect(0, 0, 90, 90);
        ctn.addChild(bg);

        var img = new createjs.Bitmap(p.avatar());
        ctn.addChild(img);


        var style = new createjs.Bitmap(p.getStyleIcon());
        style.scaleX = 1 / 16;
        style.scaleY = 1 / 16;
        style.x = 50;
        style.y = -16;
        ctn.addChild(style);

        var name = new createjs.Text(p.name + '', "30px Arial", "#a2a2a2");
        name.x = 5;
        name.y = 60;
        ctn.addChild(name);

        var eloScore = new createjs.Text(p.eloScore + '', "30px Arial", "#202020");
        eloScore.x = 5;
        eloScore.y = 95;
        ctn.addChild(eloScore);

        return ctn;
    }
}