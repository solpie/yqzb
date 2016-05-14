/// <reference path="../Model/appInfo.ts"/>
/// <reference path="../Model/Command.ts"/>
/// <reference path="../Model/ElemID.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../lib.ts"/>
class BaseView {
    stage:any;
    isClient:Boolean = false;

    constructor(stage, isClient) {
        this.stage = stage;
        this.isClient = isClient;

    }

    show() {

    }

    hide() {

    }

    newBtn(func) {
        var btn = new createjs.Shape();
        btn.graphics.beginFill("#ccc");
        btn.graphics.drawRect(0, 0, 75, 30);
        btn.addEventListener("click", func);
        return btn;
    }

    path(p) {
        if (this.isClient)
            return '/' + p;
        return p;
    }
}