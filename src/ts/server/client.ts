/// <reference path="../lib.ts"/>
/// <reference path="Config.ts"/>
/// <reference path="views/StagePanelView.ts"/>
/// <reference path="views/PlayerPanelView.ts"/>
/// <reference path="../view/BaseView.ts"/>
/// <reference path="../model/Command.ts"/>
/// <reference path="../model/ElemID.ts"/>
/// <reference path="models/TeamInfo.ts"/>
var cmd:Command = new Command();
// var appInfo = new AppInfo();
// appInfo.isServer = false;
declare var msgpack:{
    encode(obj:any):any;
    decode(obj:any):any;
};
class Client {
    panel:BaseView;
    pid:number;
    isOB:boolean;
    teamInfo:TeamInfo;
    constructor(pid, isOB, host, port) {
        this.pid = pid;
        this.initWsClient(pid, host, port);
        this.isOB = isOB;
    }

    initWsClient(pid, host, port) {
        var wsc = new WebSocket('ws://' + host + ':' + port);
        var isAlive = false;
        var relinkTimer;
        var initReq = function () {
            wsc.send(msgpack.encode({req: "info", pid: pid}));
        };
        var relink = ()=> {
            console.log('ws relink');
            wsc = this.initWsClient(pid, host, port);
            if (isAlive)
                clearInterval(relinkTimer)
        };

        wsc.onopen = function () {
            isAlive = true;
            initReq()
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
        wsc.onclose = (event)=> {
            isAlive = false;
            console.log(event);
            // relinkTimer = setInterval(relink, 1);
        };
        wsc.onerror = (event)=> {
            console.log(event);
        };
        cmd.proxy = (type:any, param?)=> {
            wsc.send(msgpack.encode({req: "op", pid: pid, param: {type: type, param: param}}))
        };
        return wsc;
    }

    initPanel(pid, param) {
        var stage = this.initCanvas();
        var viewMap = {};
        viewMap[PanelId.stagePanel] = StagePanelView;
        viewMap[PanelId.playerPanel] = PlayerPanelView;
        viewMap[PanelId.actPanel] = PlayerPanelView;
        this.panel = new viewMap[pid](stage, this.isOB);
        this.panel.init(param);
    }

    initCanvas() {
        var stageWidth = 1920;
        var stageHeight = 1080;
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