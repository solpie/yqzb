/// <reference path="../tsd/createjs.d.ts"/>
/// <reference path="../tsd/JQuery.ts"/>
/// <reference path="../utils/JsFunc.ts"/>
/// <reference path="Config.ts"/>
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


class BaseCanvasView {
    stageWidth = 1920;
    stageHeight = 1080;
    stage:any;
    isOp:Boolean = false;
    ctn:any;

    constructor(stage, isOp) {
        this.stage = stage;
        this.isOp = isOp;
    }

    init(param) {
        var ctn = new createjs.Container();
        this.ctn = ctn;
        this.stage.addChild(ctn);
        cmd.emit(CommandId.initPanel, param);
    }

    initOp() {
        $(".inputPanel").show();
    }

    newBtn(func, text?) {
        var ctn = new createjs.Container();
        var btn = new createjs.Shape();
        var btnWidth = 75 * 3, btnHeight = 30 * 3;
        btn.graphics
            .beginFill("#3c3c3c")
            .drawRect(0, 0, btnWidth, btnHeight);
        btn.addEventListener("click", func);
        // btn.addEventListener("mousedown", func);
        ctn.addChild(btn);
        if (text) {
            var txt = new createjs.Text(text, "30px Arial", "#e2e2e2");
            txt.x = (btnWidth - txt.getMeasuredWidth()) * .5;
            txt.y = (btnHeight - txt.getMeasuredHeight()) * .5 - 5;
            txt.mouseEnabled = false;
            ctn.addChild(txt);
        }
        return ctn;
    }
}

class Client {
    panel:BaseCanvasView;
    pid:number;
    isOB:boolean;

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
        this.panel = new BaseCanvasView(stage, this.isOB);
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