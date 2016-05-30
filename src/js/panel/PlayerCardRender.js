function getLeftPlayerCard(avatarPath, scale) {
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
    var avatarBmp = new createjs.Bitmap(avatarPath);
    avatarBmp.mask = leftMask;
    avatarCtn.addChild(leftMask);
    avatarCtn.addChild(avatarBmp);
    leftAvatarBmp = avatarBmp;
    avatarBmp.scaleX = avatarBmp.scaleY = scale;
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


function getRightPlayerCard(avatarPath, scale) {
    var ctn = new createjs.Container();
    var rightAvatarBg = new createjs.Bitmap("/img/panel/rightAvatarBg.png");//694x132
    rightAvatarBg.x = 14;
    rightAvatarBg.y = 6;

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
    var avatarBmp = new createjs.Bitmap(avatarPath);
    avatarBmp.mask = rightMask;
    rightAvatarCtn.addChild(rightMask);
    rightAvatarCtn.addChild(avatarBmp);
    rightAvatarBmp = avatarBmp;
    avatarBmp.scaleX = avatarBmp.scaleY = scale;
//        this.avatarArr.push(rightAvatarCtn);
    ctn.addChild(rightAvatarCtn);
    ctn.addChild(rightAvatarBg);

    var rightEloBg = new createjs.Bitmap("/img/panel/rightEloBg.png");//694x132
    rightEloBg.x = rightAvatarBg.x + 125;
    rightEloBg.y = 70;
    ctn.addChild(rightEloBg);

    var rightEloLabel = new createjs.Text("99999", "18px Arial", "#e2e2e2");
    rightEloLabel.textAlign = "right";
    rightEloLabel.x = rightEloBg.x + 53;
    rightEloLabel.y = rightEloBg.y + 3;
//        this.eloLabelArr.push(rightEloLabel);
    ctn.addChild(rightEloLabel);


    var styleCtn = new createjs.Container();
    var rightStyleIcon = new createjs.Bitmap("/img/panel/huo.png");//694x132
    styleCtn.x = rightAvatarBg.x + 60;
    styleCtn.y = rightAvatarBg.y + 80;
//        this.styleArr.push(styleCtn);
    styleCtn.addChild(rightStyleIcon);
    ctn.addChild(styleCtn);

    var rightNameLabel = new createjs.Text("player", "bold 18px Arial", "#e2e2e2");
    rightNameLabel.textAlign = "right";
    rightNameLabel.x = rightAvatarBg.x + 195;
    rightNameLabel.y = rightAvatarBg.y + 90;
//        this.nameLabelArr.push(rightNameLabel);
    ctn.addChild(rightNameLabel);
    return ctn;
}