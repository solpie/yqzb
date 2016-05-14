/// <reference path="../lib.ts"/>
/// <reference path="../model/Command.ts"/>
/// <reference path="../view/StagePanelView.ts"/>
var cmd:Command = new Command();
var appInfo = null;
class Client {
    panel:any;
    pid:number;
    isOB:boolean;

    constructor(pid, isOB) {
        this.pid = pid;
        this.initWsClient(pid);
        this.isOB = isOB;
    }

    initWsClient(pid) {
        var wsc = new WebSocket('ws://localhost:8080');
        wsc.onopen = function () {
            wsc.send('{"req":"info","param":"' + pid + '"}');
        };
        wsc.onmessage = (event)=> {
            console.log(event.data);
            var info = JSON.parse(event.data);
            if (info.res == "cmd")
                cmd.emit(info.cmd, info.param);
            else if (info.res == "init") {
                if (pid == PanelId.stagePanel) {
                        this.panel = new TopPanelView(this.initCanvas(), true,this.isOB);
                    this.panel.init(info.param);
                    console.log("new panel");
                }
            }
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