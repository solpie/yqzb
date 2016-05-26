/// <reference path="../../view/BaseView.ts"/>
/// <reference path="PlayerView.ts"/>
/// <reference path="NoticePanelView.ts"/>

class StagePanelView extends BaseView {
    init(param) {
        super.init(param);
        var ctn = new createjs.Container();
        this.ctn = ctn;
        this.stage.addChild(ctn);
        cmd.emit(CommandId.initPanel, param);
    }
}