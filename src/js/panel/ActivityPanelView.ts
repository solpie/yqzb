/**
 * Created by toramisu on 2016/5/28.
 */
/// <reference path="../clientDef.ts"/>
/// <reference path="../../ts/server/models/ActivityInfo.ts"/>
class ActivityPanelView {
    ctn:any;
    parent:any;
    isInit:Boolean;

    constructor(parent) {
        this.parent = parent;
        this.preload();
    }

    init() {
        this.ctn = new createjs.Container();
        // var bg = new createjs.Bitmap('/img/panel/act/bg.png');
        // this.ctn.addChild(bg);
        this.isInit = true;
    }

    fadeIn(actInfo:ActivityInfo) {
        if (!this.isInit)
            this.init();
        this.ctn.alpha = 0;
        this.parent.addChild(this.ctn);
        for (var gameInfo of actInfo.gameInfoArr) {
            
        }
        createjs.Tween.get(this.ctn)
            .to({alpha: 1}, 300);
    }

    fadeOut() {

    }

    preload() {
        var imgArr = [];
        for (var imgSrc of imgArr) {
            var img = new Image();
            img.src = imgSrc;
        }
    }
}