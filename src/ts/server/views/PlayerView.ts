/// <reference path="../models/PlayerInfo.ts"/>

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
            bg.x = -192 + 60;
            bg.y = -135 + 30;
        }
        else {
            bg.x = -176 + 60;
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
        this.nameLabel = name;

        var eloScore;
        eloScore = new createjs.Text(p.eloScore(), "bold 32px Arial", nameCol);
        eloScore.textAlign = 'center';
        eloScore.x = name.x;
        eloScore.y = 245 + 30;
        if (isMvp)
            eloScore.y += 30;
        ctn.addChild(eloScore);

        var eloScoreDt = new createjs.Text("+" + p.eloScore(), "12px Arial", col);
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
        winpercent.y = 290 + 30;
        if (isMvp)
            winpercent.y += 35;
        ctn.addChild(winpercent);

        var gameCount = new createjs.Text("总场数" + p.gameCount(), "18px Arial", col);
        gameCount.textAlign = 'center';
        gameCount.x = name.x;
        gameCount.y = 320 + 30;
        if (isMvp)
            gameCount.y += 35;
        ctn.addChild(gameCount);

        var style = new createjs.Bitmap(p.getWinStyleIcon());
        style.x = 50 + 60;
        style.y = 340 + 30;
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

    static getLeftStagePlayerCard(playerInfo:PlayerInfo) {
        //width 150
        var ctn = new createjs.Container();
        var leftAvatarBg = new createjs.Bitmap("/img/panel/leftAvatarBg.png");//694x132
        leftAvatarBg.x = 15;
        leftAvatarBg.y = 6;

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
        var img = new Image();
        img.onload = function () {
            avatarBmp.scaleX = avatarBmp.scaleY = 180 / this.width;
        };
        img.src = playerInfo.avatar();
        var avatarBmp = new createjs.Bitmap(playerInfo.avatar());
        avatarBmp.mask = leftMask;
        avatarCtn.addChild(leftMask);
        avatarCtn.addChild(avatarBmp);
        // leftAvatarBmp = avatarBmp;
//        this.avatarArr.push(avatarCtn);
        ctn.addChild(avatarCtn);
        ctn.addChild(leftAvatarBg);

        var leftEloBg = new createjs.Bitmap("/img/panel/leftEloBg.png");//694x132
        leftEloBg.x = leftAvatarBg.x + 27;
        leftEloBg.y = 70;
        ctn.addChild(leftEloBg);

        var leftEloLabel = new createjs.Text("1984", "18px Arial", "#e2e2e2");
        leftEloLabel.textAlign = "left";
        leftEloLabel.x = leftEloBg.x + 12;
        leftEloLabel.y = leftEloBg.y + 3;
//        this.eloLabelArr.push(leftEloLabel);
        ctn.addChild(leftEloLabel);


        var styleCtn = new createjs.Container();
        var leftStyleIcon = new createjs.Bitmap("/img/panel/feng.png");//694x132
        styleCtn.x = leftAvatarBg.x + 120;
        styleCtn.y = leftAvatarBg.y + 80;
        styleCtn.addChild(leftStyleIcon);
//        this.styleArr.push(styleCtn);
        ctn.addChild(styleCtn);

        var leftNameLabel = new createjs.Text("player", "bold 18px Arial", "#e2e2e2");
        leftNameLabel.textAlign = "left";
        leftNameLabel.x = leftAvatarBg.x + 20;
        leftNameLabel.y = leftAvatarBg.y + 90;
//        this.nameLabelArr.push(leftNameLabel);
        ctn.addChild(leftNameLabel);

        return ctn;
    }
}