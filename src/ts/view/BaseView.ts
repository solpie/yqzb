/// <reference path="../Model/appInfo.ts"/>
/// <reference path="../Model/Command.ts"/>
/// <reference path="../Model/ElemID.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../lib.ts"/>
class BaseView {
    stage:any;
    isClient:Boolean = false;
    isOp:Boolean = false;

    constructor(stage, isClient, isOp) {
        this.stage = stage;
        this.isClient = isClient;
        this.isOp = isOp;
    }

    show() {

    }

    hide() {

    }

    newBtn(func, text?) {
        var ctn = new createjs.Container();
        var btn = new createjs.Shape();
        btn.graphics
            .beginFill("#3c3c3c")
            .drawRect(0, 0, 75, 30);
        btn.addEventListener("click", func);
        // btn.addEventListener("mousedown", func);
        ctn.addChild(btn);
        if (text) {
            var txt = new createjs.Text(text, "15px Arial", "#e2e2e2");
            txt.x = (75 - txt.getMeasuredWidth()) * .5;
            txt.y = 5;
            txt.mouseEnabled = false;
            ctn.addChild(txt);
        }
        return ctn;
    }

    emit(clientFunc, serverFunc) {
        if (this.isClient) {
            clientFunc();
        }
        else {
            serverFunc();
        }
    }

    path(p) {
        if (this.isClient)
            return '/' + p;
        return p;
    }
}