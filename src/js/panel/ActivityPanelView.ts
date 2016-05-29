/**
 * Created by toramisu on 2016/5/28.
 */
/// <reference path="../clientDef.ts"/>
/// <reference path="../../ts/server/models/ActivityInfo.ts"/>
/// <reference path="./BasePanelView.ts"/>

class ActivityPanelView extends BasePanelView {
    ctn:any;
    isInit:Boolean;

    constructor() {
        super();
        this.onServer();
    }

    onServer() {
        cmd.on(CommandId.initPanel, (param) => {
            console.log("initPanel::::::::", param);
            this.onInit(param)
        });
    }

    onInit(param) {
        this.stage = client.panel.stage;
        this.ctn = new createjs.Container();
        // var bg = new createjs.Bitmap('/img/panel/act/bg.png');
        // this.ctn.addChild(bg);
        this.stage.addChild(this.ctn);
    }

    fadeIn(actInfo:ActivityInfo) {

        this.ctn.alpha = 0;
        for (var gameInfo of actInfo.gameInfoArr) {

        }
        createjs.Tween.get(this.ctn)
            .to({alpha: 1}, 300);
    }

    fadeOut() {

    }

}

$(function () {
    new ActivityPanelView();
});