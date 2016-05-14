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
        if (this._func[type]) {
            for (var i = 0; i < this._func[type].length; ++i) {
                var f = this._func[type][i];
                if (f)
                    f.func(param);
            }
            if (this.broadCast)
                this.broadCast(type, param);
        }
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
    CommandId[CommandId["resetTimer"] = 100005] = "resetTimer";
    CommandId[CommandId["disableTracker"] = 100006] = "disableTracker";
    CommandId[CommandId["addLeftScore"] = 100007] = "addLeftScore";
    CommandId[CommandId["addRightScore"] = 100008] = "addRightScore";
    CommandId[CommandId["updateLeftTeam"] = 100009] = "updateLeftTeam";
    CommandId[CommandId["updateRightTeam"] = 100010] = "updateRightTeam";
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
/**
 * Created by toramisu on 2016/5/9.
 */
/// <reference path="../event/ActEvent.ts"/>
var AppInfo = (function (_super) {
    __extends(AppInfo, _super);
    function AppInfo() {
        _super.call(this);
        console.log("");
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
    function BaseView(stage, isClient) {
        this.isClient = false;
        this.stage = stage;
        this.isClient = isClient;
    }
    BaseView.prototype.show = function () {
    };
    BaseView.prototype.hide = function () {
    };
    BaseView.prototype.path = function (p) {
        if (this.isClient)
            return '/' + p;
        return p;
    };
    return BaseView;
}());
/// <reference path="BaseView.ts"/>
var TopPanelView = (function (_super) {
    __extends(TopPanelView, _super);
    function TopPanelView(stage, isClient) {
        _super.call(this, stage, isClient);
        this.init();
    }
    TopPanelView.prototype.init = function () {
        var _this = this;
        var bg = new createjs.Bitmap(this.path("img/panelTop.png"));
        bg.x = 150;
        bg.y = 5;
        this.stage.addChild(bg);
        //left
        var leftScore = 0;
        var rightScore = 0;
        var px = 205;
        var py = 40;
        var circleArr = [];
        var circleRArr = [];
        for (var i = 0; i < 5; i++) {
            var spCircle = new createjs.Shape();
            spCircle.graphics.beginFill("#7f745b");
            spCircle.graphics.drawCircle(px + i * 50, py, 15);
            spCircle.graphics.beginFill("#4b4b4b");
            spCircle.graphics.drawCircle(px + i * 50, py, 12);
            if (!this.isClient) {
                spCircle.addEventListener("click", function () {
                    cmd.emit(CommandId.addLeftScore);
                });
            }
            this.stage.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#ffff00");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            this.stage.addChild(circleHide);
            if (!this.isClient) {
                circleHide.addEventListener("click", function () {
                    cmd.emit(CommandId.addLeftScore);
                });
            }
            circleHide.alpha = 0;
            circleArr.push(circleHide);
        }
        //right
        px = 700;
        for (var i = 0; i < 5; i++) {
            var spCircle = new createjs.Shape();
            spCircle.graphics.beginFill("#7f745b");
            spCircle.graphics.drawCircle(px + i * 50, py, 15);
            spCircle.graphics.beginFill("#4b4b4b");
            spCircle.graphics.drawCircle(px + i * 50, py, 12);
            if (!this.isClient) {
                spCircle.addEventListener("click", function () {
                    cmd.emit(CommandId.addRightScore);
                });
            }
            this.stage.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#0c83fc");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            if (!this.isClient) {
                circleHide.addEventListener("click", function () {
                    cmd.emit(CommandId.addRightScore);
                });
            }
            this.stage.addChild(circleHide);
            circleHide.alpha = 0;
            circleRArr.push(circleHide);
        }
        var leftScoreLabel = new createjs.Text("0", "30px Arial", "#a2a2a2");
        leftScoreLabel.x = 490;
        leftScoreLabel.y = 30;
        var rightScoreLabel = new createjs.Text("0", "30px Arial", "#a2a2a2");
        rightScoreLabel.x = 600;
        rightScoreLabel.y = 30;
        this.stage.addChild(leftScoreLabel);
        this.stage.addChild(rightScoreLabel);
        cmd.on(CommandId.addLeftScore, function () {
            leftScore++;
            if (leftScore > 5) {
                leftScore = 0;
            }
            leftScoreLabel.text = leftScore + "";
            for (var i = 0; i < 5; i++) {
                if (i < leftScore) {
                    createjs.Tween.get(circleArr[i]).to({ alpha: 1 }, 200);
                }
                else {
                    createjs.Tween.get(circleArr[i]).to({ alpha: 0 }, 200);
                }
            }
            console.log(leftScore);
        });
        cmd.on(CommandId.addRightScore, function () {
            rightScore++;
            if (rightScore > 5) {
                rightScore = 0;
            }
            rightScoreLabel.text = rightScore + "";
            for (var i = 0; i < 5; i++) {
                if (i < rightScore) {
                    createjs.Tween.get(circleRArr[5 - 1 - i]).to({ alpha: 1 }, 200);
                }
                else {
                    createjs.Tween.get(circleRArr[5 - 1 - i]).to({ alpha: 0 }, 200);
                }
            }
        });
        ///time label---------------------------------------------------
        var time = 0;
        var timeLabel = new createjs.Text("99:99", "30px Arial", "#a2a2a2");
        timeLabel.x = 520;
        timeLabel.y = 90;
        var isRunning = false;
        cmd.on(CommandId.toggleTimer, function () {
            if (isRunning) {
                clearInterval(_this.timerId);
                $("#btnToggleTime").val("开始");
                isRunning = false;
            }
            else {
                _this.timerId = setInterval(function () {
                    time++;
                    timeLabel.text = _this.formatSecond(time);
                }, 1000);
                $("#btnToggleTime").val("暂停");
                isRunning = true;
            }
        });
        cmd.on(CommandId.resetTimer, function () {
            //$("#btnResetTime").on(MouseEvt.CLICK, ()=> {
            time = 0;
            timeLabel.text = _this.formatSecond(time);
        });
        this.stage.addChild(timeLabel);
    };
    TopPanelView.prototype.formatSecond = function (sec) {
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
    return TopPanelView;
}(BaseView));
/// <reference path="../lib.ts"/>
/// <reference path="../model/Command.ts"/>
/// <reference path="../view/StagePanelView.ts"/>
var cmd = new Command();
var Client = (function () {
    function Client(pid) {
        this.initWsClient();
        if (pid == PanelId.stagePanel) {
            this.panel = new TopPanelView(this.initCanvas(), true);
        }
    }
    Client.prototype.initWsClient = function () {
        var wsc = new WebSocket('ws://localhost:8080');
        wsc.onmessage = function (event) {
            console.log(event.data);
            var info = JSON.parse(event.data);
            cmd.emit(info.cmd, info.param);
        };
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
