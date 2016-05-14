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
    path(p){
        if(this.isClient)
            return '/' + p;
        return p;
    }
}