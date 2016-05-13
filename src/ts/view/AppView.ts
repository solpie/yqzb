/**
 * Created by toramisu on 2016/5/9.
 */
/// <reference path="StageView.ts"/>
/// <reference path="WinView.ts"/>
/// <reference path="TopPanelView.ts"/>
/// <reference path="KeyInput.ts"/>
/// <reference path="../JQuery.ts"/>
var Keys = {
    GraveAccent: (k)=> {
        return k == 192
    },
    Space: function (k) {
        return k == 32;
    },
    ESC: function (k) {
        return k == 27;
    },
    Char: function (key, c) {
        return key == c.charCodeAt(0);
    },
};
class YuanqiTvView {
    appInfo:any;
    stageView:StageView;
    winView:WindowView;
    panelView:TopPanelView;

    constructor(appModel) {
        this.appInfo = appModel;
        console.log("dd");


        document.onmousemove = (e)=> {
            this.appInfo.mouseX = e.clientX;
            this.appInfo.mouseY = e.clientY;
            this.appInfo.emit(MouseEvt.MOVE);
        };
        document.onmouseup = ()=> {
            this.appInfo.emit(MouseEvt.UP);
        };

        document.onkeydown = KeyInput.onKeyDown;


        function initCamera() {
            if (navigator.webkitGetUserMedia) {
                navigator.webkitGetUserMedia({video: true}, onSuccess, onFail);
            }
            else {
                alert('webRTC not available');
            }
        }

        function onSuccess(stream) {
            document.getElementById('camFeed').src = webkitURL.createObjectURL(stream);
        }

        function onFail() {
            alert('could not connect stream');
        }

        initCamera();
    }

    run() {
        this.winView = new WindowView();
        this.stageView = new StageView();
        console.log("run");
    }
}