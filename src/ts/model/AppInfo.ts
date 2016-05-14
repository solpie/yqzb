/**
 * Created by toramisu on 2016/5/9.
 */
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="PanelInfo.ts"/>

class AppInfo extends EventDispatcher {
    mouseX:number;
    mouseY:number;
    panelInfo:PanelInfo;

    constructor() {
        super();
        console.log("");
        this.panelInfo = new PanelInfo();
    }
}