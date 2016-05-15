/**
 * Created by toramisu on 2016/5/9.
 */
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="PanelInfo.ts"/>

class AppInfo extends EventDispatcher {
    mouseX:number;
    mouseY:number;
    panel:PanelInfo;
    isServer:boolean;
    wsc:any;
    constructor() {
        super();
        console.log("");
        this.panel = new PanelInfo();
    }
}