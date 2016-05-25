/// <reference path="PlayerView.ts"/>

class PlayerPanelView extends BaseView {
    handle() {

    }
    init(param) {
        super.init(param);
        var ctn = new createjs.Container();
        this.ctn = ctn;
        this.stage.addChild(ctn);
        cmd.emit(CommandId.initPanel, param);
    }
}