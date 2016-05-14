/// <reference path="../lib.ts"/>
/// <reference path="../model/Command.ts"/>
/// <reference path="../view/StagePanelView.ts"/>
var cmd:Command = new Command();

class Client {
    panel:any;

    constructor(pid) {
        this.initWsClient();
        if (pid == PanelId.stagePanel) {
            this.panel = new TopPanelView(this.initCanvas(), true);
        }
    }

    initWsClient() {
        var wsc = new WebSocket('ws://localhost:8080');
        wsc.onmessage = function (event) {
            console.log(event.data);
            var info = JSON.parse(event.data);
            cmd.emit(info.cmd, info.param);
        };
    }

    initCanvas() {
        var stageWidth = 1280;
        var stageHeight = 720;
        var canvas = document.getElementById("stage");
        canvas.setAttribute("width", stageWidth + "");
        canvas.setAttribute("height", stageHeight + "");
        var stage = new createjs.Stage(canvas);
        stage.autoClear = true;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", function () {
            stage.update();
        });
        return stage;
    }
}