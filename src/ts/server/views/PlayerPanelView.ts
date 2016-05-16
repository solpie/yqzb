class PlayerPanelView extends BaseView {
    constructor(stage, isOp) {
        super(stage, isOp);
    }

    handle() {

    }

    init(param) {
        super.init(param);
        var ctn = new createjs.Container();
        this.ctn = ctn;
        this.stage.addChild(ctn);

        var bg = new createjs.Shape();
        bg.graphics.beginFill("#ccc").drawRoundRect(0, 0, 520, 180, 10);
        ctn.addChild(bg);

        var playerName =new createjs.Text("0", "30px Arial", "#a2a2a2");
        playerName.text = param.playerInfo.name;
        ctn.addChild(playerName);
        if (this.isOp) {
        }
    }
}