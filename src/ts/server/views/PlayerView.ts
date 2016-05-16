class PlayerView {
    
    static getPlayerCard(p:PlayerInfo) {
        var ctn = new createjs.Container();
        var bg = new createjs.Shape();
        bg.graphics.beginBitmapFill('#cccc').drawRect(0, 0, 90, 90);
        ctn.addChild(bg);

        var img = new createjs.Bitmap(p.avatar);
        ctn.addChild(img);



        var style = new createjs.Bitmap(p.getStyleIcon());
        style.scaleX = 1/16;
        style.scaleY = 1/16;
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