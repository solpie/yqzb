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

    newBtn(func) {
        var btn = new createjs.Shape();
        btn.graphics.beginFill("#ccc");
        btn.graphics.drawRect(0, 0, 75, 30);
        btn.addEventListener("click", func);
        return btn;
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