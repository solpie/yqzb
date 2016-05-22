/// <reference path="PlayerView.ts"/>

class PlayerPanelView extends BaseView {
    // constructor(stage, isOp) {
    //     super(stage, isOp);
    // }

    handle() {

    }

    init(param) {
        super.init(param);
        
        var ctn = new createjs.Container();
        this.ctn = ctn;
        this.stage.addChild(ctn);
    }
}