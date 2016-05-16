/// <reference path="../lib.ts"/>
/// <reference path="Config.ts"/>
/// <reference path="../model/Command.ts"/>
/// <reference path="./views/StagePanelView.ts"/>
/// <reference path="./views/PlayerPanelView.ts"/>
var cmd:Command = new Command();
var appInfo = new AppInfo();
appInfo.isServer = false;
class Client {
    panel:BaseView;
    pid:number;
    isOB:boolean;

    constructor(pid, isOB) {
        this.pid = pid;
        this.initWsClient(pid);
        this.isOB = isOB;
    }

    initWsClient(pid) {
        var wsc = new WebSocket('ws://localhost:' + serverConf.port);
        wsc.onopen = function () {
            wsc.send('{"req":"info","pid":"' + pid + '"}');
        };
        wsc.onmessage = (event)=> {
            console.log(event.data);
            var info = JSON.parse(event.data);
            if (info.res == "cmd")
                cmd.emit(info.cmd, info.param);
            else if (info.res == "init") {
                this.initPanel(pid, info.param);
            }
        };
        cmd.proxy = (type:any, param?)=> {
            wsc.send(JSON.stringify({req: "op", pid: pid, param: {type: type, param: param}}))
        };
        appInfo.wsc = wsc;
    }

    initPanel(pid, param) {
        var stage = this.initCanvas();
        var view;
        if (pid == PanelId.stagePanel) {
            view = StagePanelView;
        }
        else if (pid == PanelId.playerPanel) {
            view = PlayerPanelView;
        }
        this.panel = new view(stage, this.isOB);
        this.panel.init(param);
    }

    initCanvas() {
        var stageWidth = 1280;
        var stageHeight = 720;
        var canvas = document.getElementById("stage");
        canvas.setAttribute("width", stageWidth + "");
        canvas.setAttribute("height", stageHeight + "");
        var stage = new createjs.Stage(canvas);
        stage.autoClear = true;
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", function () {
            stage.update();
        });
        return stage;
    }
}