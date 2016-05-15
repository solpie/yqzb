var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function chooseFile(name) {
    var chooser = $(name);
    chooser.unbind('change');
    //chooser.change(function (evt) {
    //});
    chooser.trigger('click');
    return chooser;
}
/// <reference path="JQuery.ts"/>
/// <reference path="libs/createjs/easeljs.d.ts"/>
/// <reference path="libs/createjs/createjs.d.ts"/>
/// <reference path="libs/createjs/createjs-lib.d.ts"/>
/// <reference path="libs/createjs/tweenjs.d.ts"/>
var EventDispatcher = (function () {
    function EventDispatcher() {
        this._func = {};
        this._funcId = 0;
    }
    EventDispatcher.prototype.on = function (type, func) {
        if (!this._func[type])
            this._func[type] = [];
        this._funcId++;
        this._func[type].push({ func: func, id: this._funcId });
    };
    EventDispatcher.prototype.emit = function (type, param) {
        if (param === void 0) { param = null; }
        if (this._func[type]) {
            for (var i = 0; i < this._func[type].length; ++i) {
                var f = this._func[type][i];
                if (f)
                    f.func(param);
            }
        }
        if (this.broadCast)
            this.broadCast(type, param);
    };
    EventDispatcher.prototype.del = function (type, funcId) {
        if (funcId === void 0) { funcId = -1; }
        if (this._func[type])
            if (funcId < 0) {
                this._func[type] = [];
            }
            else {
                for (var i = 0; i < this._func[type].length; ++i) {
                    var f = this._func[type][i];
                    if (f) {
                        if (f.id == funcId) {
                            delete this._func[type][i];
                            console.log('del event', type, funcId);
                            break;
                        }
                    }
                }
            }
    };
    EventDispatcher.prototype.removeAll = function () {
        this._func = {};
    };
    return EventDispatcher;
}());
/// <reference path="../event/EventDispatcher.ts"/>
var CommandId;
(function (CommandId) {
    CommandId[CommandId["ShowConsoleWin"] = 100000] = "ShowConsoleWin";
    //test cmd
    CommandId[CommandId["testSwapTrack"] = 100001] = "testSwapTrack";
    //
    CommandId[CommandId["toggleTracker"] = 100002] = "toggleTracker";
    CommandId[CommandId["toggleBallRolling"] = 100003] = "toggleBallRolling";
    CommandId[CommandId["toggleTimer"] = 100004] = "toggleTimer";
    CommandId[CommandId["cs_toggleTimer"] = 100005] = "cs_toggleTimer";
    CommandId[CommandId["resetTimer"] = 100006] = "resetTimer";
    CommandId[CommandId["cs_resetTimer"] = 100007] = "cs_resetTimer";
    CommandId[CommandId["disableTracker"] = 100008] = "disableTracker";
    CommandId[CommandId["addLeftScore"] = 100009] = "addLeftScore";
    CommandId[CommandId["cs_addLeftScore"] = 100010] = "cs_addLeftScore";
    CommandId[CommandId["addRightScore"] = 100011] = "addRightScore";
    CommandId[CommandId["cs_addRightScore"] = 100012] = "cs_addRightScore";
    CommandId[CommandId["updateLeftTeam"] = 100013] = "updateLeftTeam";
    CommandId[CommandId["updateRightTeam"] = 100014] = "updateRightTeam";
})(CommandId || (CommandId = {}));
var CommandItem = (function () {
    function CommandItem(id) {
        this.id = id;
    }
    return CommandItem;
}());
var Command = (function (_super) {
    __extends(Command, _super);
    function Command() {
        _super.call(this);
        this.cmdArr = [];
        this.newCmd(CommandId.addLeftScore, "addLeftScore");
        this.newCmd(CommandId.addRightScore, "addRightScore");
        this.newCmd(CommandId.toggleTracker, "toggleTracker");
        this.newCmd(CommandId.toggleTimer, "toggleTimer");
        this.newCmd(CommandId.toggleBallRolling, "toggleBallRolling");
        this.newCmd(CommandId.disableTracker, "disableTracker");
        ////test cmd
        this.newCmd(CommandId.testSwapTrack, "test swap track");
    }
    Command.prototype.newCmd = function (id, name, desc) {
        var ci = new CommandItem(id);
        ci.name = name;
        ci.desc = desc;
        this.cmdArr.push(ci);
    };
    return Command;
}(EventDispatcher));
/// <reference path="EventDispatcher.ts"/>
var BaseEvent = (function () {
    function BaseEvent() {
    }
    return BaseEvent;
}());
var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["LEFT"] = 0] = "LEFT";
    MouseButton[MouseButton["MID"] = 1] = "MID";
    MouseButton[MouseButton["RIGHT"] = 2] = "RIGHT";
})(MouseButton || (MouseButton = {}));
var MouseEvt = (function () {
    function MouseEvt() {
    }
    MouseEvt.CLICK = "click"; //build-in name
    MouseEvt.DBLCLICK = "dblclick"; //build-in name
    MouseEvt.MOVE = "mousemove";
    MouseEvt.UP = "mouseup"; //build-in name
    MouseEvt.DOWN = "mousedown"; //build-in name
    MouseEvt.LEAVE = "mouseleave"; //build-in name
    MouseEvt.RCLICK = "contextmenu"; //build-in name
    return MouseEvt;
}());
var KeyEvt = (function () {
    function KeyEvt() {
    }
    KeyEvt.DOWN = "keydown"; //build-in name
    KeyEvt.UP = "keyup"; //build-in name
    KeyEvt.PRESS = "keypress"; //build-in name
    return KeyEvt;
}());
var ViewEvent = (function () {
    function ViewEvent() {
    }
    ViewEvent.CHANGED = "change"; //build-in name
    ViewEvent.RESIZE = "resize";
    ViewEvent.SCROLL = "scroll";
    ViewEvent.LOADED = "loaded";
    ViewEvent.HIDED = "hided";
    return ViewEvent;
}());
/// <reference path="../event/ActEvent.ts"/>
var PanelInfo = (function () {
    function PanelInfo() {
        this.stage = new StagePanelInfo();
    }
    return PanelInfo;
}());
var StagePanelInfo = (function (_super) {
    __extends(StagePanelInfo, _super);
    function StagePanelInfo() {
        _super.apply(this, arguments);
        this.winScore = 5;
        this.leftScore = 0;
        this.rightScore = 0;
        this.time = 0;
        this.timerState = 0;
    }
    StagePanelInfo.prototype.addLeftScore = function () {
        this.leftScore = (this.leftScore + 1) % (this.winScore + 1);
        cmd.emit(CommandId.addLeftScore, this.leftScore);
    };
    StagePanelInfo.prototype.addRightScore = function () {
        this.rightScore = (this.rightScore + 1) % (this.winScore + 1);
        cmd.emit(CommandId.addRightScore, this.rightScore);
    };
    StagePanelInfo.prototype.toggleTimer = function () {
        cmd.emit(CommandId.toggleTimer);
    };
    StagePanelInfo.prototype.resetTimer = function () {
        cmd.emit(CommandId.resetTimer);
    };
    return StagePanelInfo;
}(EventDispatcher));
/**
 * Created by toramisu on 2016/5/9.
 */
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="PanelInfo.ts"/>
var AppInfo = (function (_super) {
    __extends(AppInfo, _super);
    function AppInfo() {
        _super.call(this);
        console.log("");
        this.panel = new PanelInfo();
    }
    return AppInfo;
}(EventDispatcher));
var ElmId$ = {
    buttonAddLeftScore: "#btnAddLeftScore",
    buttonAddRightScore: "#btnAddRightScore"
};
var PanelId = {
    stagePanel: 'StagePanel'
};
/// <reference path="../Model/appInfo.ts"/>
/// <reference path="../Model/Command.ts"/>
/// <reference path="../Model/ElemID.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../lib.ts"/>
var BaseView = (function () {
    function BaseView(stage, isClient, isOp) {
        this.isClient = false;
        this.isOp = false;
        this.stage = stage;
        this.isClient = isClient;
        this.isOp = isOp;
    }
    BaseView.prototype.show = function () {
    };
    BaseView.prototype.hide = function () {
    };
    BaseView.prototype.newBtn = function (func, text) {
        var ctn = new createjs.Container();
        var btn = new createjs.Shape();
        btn.graphics.beginFill("#3c3c3c");
        btn.graphics.drawRect(0, 0, 75, 30);
        btn.addEventListener("click", func);
        ctn.addChild(btn);
        if (text) {
            var txt = new createjs.Text(text, "15px Arial", "#e2e2e2");
            txt.x = (75 - txt.getMeasuredWidth()) * .5;
            txt.y = 5;
            txt.mouseEnabled = false;
            ctn.addChild(txt);
        }
        return ctn;
    };
    BaseView.prototype.emit = function (clientFunc, serverFunc) {
        if (this.isClient) {
            clientFunc();
        }
        else {
            serverFunc();
        }
    };
    BaseView.prototype.path = function (p) {
        if (this.isClient)
            return '/' + p;
        return p;
    };
    return BaseView;
}());
/// <reference path="../../view/BaseView.ts"/>
var StagePanelView = (function (_super) {
    __extends(StagePanelView, _super);
    function StagePanelView(stage, isClient, isOp) {
        _super.call(this, stage, isClient, isOp);
        if (!this.isClient)
            this.init(null);
        this.handle();
    }
    StagePanelView.prototype.handle = function () {
        var _this = this;
        console.log("handle()");
        cmd.on(CommandId.addLeftScore, function (leftScore) {
            console.log("handle left score");
            _this.setLeftScore(leftScore);
        });
        cmd.on(CommandId.addRightScore, function (rightScore) {
            _this.setRightScore(rightScore);
        });
        cmd.on(CommandId.toggleTimer, function () {
            if (_this.timerId) {
                clearInterval(_this.timerId);
                _this.timerId = 0;
                appInfo.panel.stage.timerState = 0;
            }
            else {
                _this.timerId = setInterval(function () {
                    appInfo.panel.stage.time++;
                    _this.timeLabel.text = _this.formatSecond(appInfo.panel.stage.time);
                }, 1000);
                appInfo.panel.stage.timerState = 1;
            }
        });
        cmd.on(CommandId.resetTimer, function () {
            //$("#btnResetTime").on(MouseEvt.CLICK, ()=> {
            appInfo.panel.stage.time = 0;
            _this.timeLabel.text = _this.formatSecond(appInfo.panel.stage.time);
        });
    };
    StagePanelView.prototype.setLeftScore = function (leftScore) {
        this.leftScoreLabel.text = leftScore + "";
        for (var i = 0; i < 5; i++) {
            if (i < leftScore) {
                createjs.Tween.get(this.leftCircleArr[i]).to({ alpha: 1 }, 200);
            }
            else {
                createjs.Tween.get(this.leftCircleArr[i]).to({ alpha: 0 }, 200);
            }
        }
        console.log(leftScore);
    };
    StagePanelView.prototype.setRightScore = function (rightScore) {
        this.rightScoreLabel.text = rightScore + "";
        for (var i = 0; i < 5; i++) {
            if (i < rightScore) {
                createjs.Tween.get(this.rightCircleArr[5 - 1 - i]).to({ alpha: 1 }, 200);
            }
            else {
                createjs.Tween.get(this.rightCircleArr[5 - 1 - i]).to({ alpha: 0 }, 200);
            }
        }
    };
    StagePanelView.prototype.setTime = function (time, state) {
        this.timeLabel.text = this.formatSecond(time);
        appInfo.panel.stage.time = time;
        if (state) {
            cmd.emit(CommandId.toggleTimer);
        }
    };
    StagePanelView.prototype.init = function (param) {
        console.log("init");
        var ctn = new createjs.Container();
        this.stage.addChild(ctn);
        var bg = new createjs.Bitmap(this.path("img/panelTop.png"));
        bg.x = 150;
        ctn.addChild(bg);
        //left
        this.leftCircleArr = [];
        this.rightCircleArr = [];
        var px = 205;
        var py = 40;
        for (var i = 0; i < 5; i++) {
            var spCircle = new createjs.Shape();
            spCircle.graphics.beginFill("#7f745b");
            spCircle.graphics.drawCircle(px + i * 50, py, 15);
            spCircle.graphics.beginFill("#4b4b4b");
            spCircle.graphics.drawCircle(px + i * 50, py, 12);
            ctn.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#ffff00");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            ctn.addChild(circleHide);
            circleHide.alpha = 0;
            this.leftCircleArr.push(circleHide);
        }
        //right
        px = 700;
        for (var i = 0; i < 5; i++) {
            var spCircle = new createjs.Shape();
            spCircle.graphics.beginFill("#7f745b");
            spCircle.graphics.drawCircle(px + i * 50, py, 15);
            spCircle.graphics.beginFill("#4b4b4b");
            spCircle.graphics.drawCircle(px + i * 50, py, 12);
            ctn.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#0c83fc");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            ctn.addChild(circleHide);
            circleHide.alpha = 0;
            this.rightCircleArr.push(circleHide);
        }
        var leftScoreLabel = new createjs.Text("0", "30px Arial", "#a2a2a2");
        leftScoreLabel.x = 490;
        leftScoreLabel.y = 30;
        this.leftScoreLabel = leftScoreLabel;
        var rightScoreLabel = new createjs.Text("0", "30px Arial", "#a2a2a2");
        rightScoreLabel.x = 600;
        rightScoreLabel.y = 30;
        this.rightScoreLabel = rightScoreLabel;
        ctn.addChild(leftScoreLabel);
        ctn.addChild(rightScoreLabel);
        ///time label---------------------------------------------------
        var timeLabel = new createjs.Text("99:99", "30px Arial", "#a2a2a2");
        timeLabel.x = 520;
        timeLabel.y = 90;
        this.timeLabel = timeLabel;
        ctn.addChild(timeLabel);
        if (this.isOp) {
            var btnLeft = this.newBtn(function () {
                cmd.proxy(CommandId.cs_addLeftScore);
            });
            btnLeft.x = 450;
            btnLeft.y = 5;
            btnLeft.alpha = .5;
            ctn.addChild(btnLeft);
            var btnRight = this.newBtn(function () {
                cmd.proxy(CommandId.cs_addRightScore);
            });
            btnRight.x = 590;
            btnRight.y = 5;
            btnRight.alpha = .5;
            ctn.addChild(btnRight);
            var btn = this.newBtn(function () {
                cmd.proxy(CommandId.cs_toggleTimer);
            }, "toggle");
            btn.x = 450;
            btn.y = 100;
            btn.alpha = .5;
            ctn.addChild(btn);
            var btn = this.newBtn(function () {
                cmd.proxy(CommandId.cs_resetTimer);
            }, "reset");
            btn.x = 590;
            btn.y = 100;
            btn.alpha = .5;
            ctn.addChild(btn);
        }
        if (param) {
            this.setLeftScore(param.leftScore);
            this.setRightScore(param.rightScore);
            this.setTime(param.time, param.state);
        }
    };
    StagePanelView.prototype.formatSecond = function (sec) {
        var min = Math.floor(sec / 60);
        var s = sec % 60;
        var strMin = min + "";
        var strSec = s + "";
        if (min < 10)
            strMin = "0" + strMin;
        if (s < 10)
            strSec = "0" + strSec;
        return strMin + ":" + strSec;
    };
    return StagePanelView;
}(BaseView));
/// <reference path="../lib.ts"/>
/// <reference path="../model/Command.ts"/>
/// <reference path="./views/StagePanelView.ts"/>
var cmd = new Command();
var appInfo = new AppInfo();
appInfo.isServer = false;
var Client = (function () {
    function Client(pid, isOB) {
        this.pid = pid;
        this.initWsClient(pid);
        this.isOB = isOB;
    }
    Client.prototype.initWsClient = function (pid) {
        var _this = this;
        var wsc = new WebSocket('ws://localhost:8080');
        wsc.onopen = function () {
            wsc.send('{"req":"info","param":"' + pid + '"}');
        };
        wsc.onmessage = function (event) {
            console.log(event.data);
            var info = JSON.parse(event.data);
            if (info.res == "cmd")
                cmd.emit(info.cmd, info.param);
            else if (info.res == "init") {
                if (pid == PanelId.stagePanel) {
                    _this.panel = new StagePanelView(_this.initCanvas(), true, _this.isOB);
                    _this.panel.init(info.param);
                    console.log("new panel");
                }
            }
        };
        cmd.proxy = function (type, param) {
            wsc.send(JSON.stringify({ req: "op", param: { type: type, param: param } }));
        };
        appInfo.wsc = wsc;
    };
    Client.prototype.initCanvas = function () {
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
    };
    return Client;
}());
