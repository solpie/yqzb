/**
 * Created by toramisu on 2016/5/9.
 */
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../server/models/PanelInfo.ts"/>

class AppInfo extends EventDispatcher {
    mouseX:number;
    mouseY:number;
    panel:PanelInfo;
    isServer:boolean;
    savePlayerInfo:(playerInfo)=>any;
    parsePlayerInfo:(playerInfo)=>any;
    // wsc:any;

    constructor() {
        super();
        this.panel = new PanelInfo();
    }
}