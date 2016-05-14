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
/// <reference path="../event/ActEvent.ts"/>
var PanelInfo = (function () {
    function PanelInfo() {
        this.stagePanelInfo = new StagePanelInfo();
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
        this.panelInfo = new PanelInfo();
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
    BaseView.prototype.newBtn = function (func) {
        var btn = new createjs.Shape();
        btn.graphics.beginFill("#ccc");
        btn.graphics.drawRect(0, 0, 75, 30);
        btn.addEventListener("click", func);
        return btn;
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
        this.time = 0;
        if (!this.isClient)
            this.init(null);
        this.handle();
    }
    TopPanelView.prototype.handle = function () {
        var _this = this;
        cmd.on(CommandId.addLeftScore, function (leftScore) {
            _this.setLeftScore(leftScore);
        });
        cmd.on(CommandId.addRightScore, function (rightScore) {
            _this.setRightScore(rightScore);
        });
    };
    TopPanelView.prototype.setLeftScore = function (leftScore) {
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
    TopPanelView.prototype.setRightScore = function (rightScore) {
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
    TopPanelView.prototype.setTime = function (time, state) {
        var _this = this;
        this.timeLabel.text = this.formatSecond(time);
        if (state) {
            this.timerId = setInterval(function () {
                _this.time++;
                _this.timeLabel.text = _this.formatSecond(time);
            }, 1000);
        }
    };
    TopPanelView.prototype.init = function (param) {
        var _this = this;
        var container = new createjs.Container();
        this.stage.addChild(container);
        var bg = new createjs.Bitmap(this.path("img/panelTop.png"));
        bg.x = 150;
        container.addChild(bg);
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
            // if (!this.isClient) {
            //     spCircle.addEventListener("click", function () {
            //         appInfo.panelInfo.stagePanelInfo.addLeftScore();
            //     });
            // }
            container.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#ffff00");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            container.addChild(circleHide);
            // if (!this.isClient) {
            //     circleHide.addEventListener("click", function () {
            //         appInfo.panelInfo.stagePanelInfo.addLeftScore();
            //     });
            // }
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
            // if (!this.isClient) {
            //     spCircle.addEventListener("click", function () {
            //         appInfo.panelInfo.stagePanelInfo.addRightScore();
            //     });
            // }
            container.addChild(spCircle);
            var circleHide = new createjs.Shape();
            circleHide.graphics.beginFill("#0c83fc");
            circleHide.graphics.drawCircle(px + i * 50, py, 12);
            // if (!this.isClient) {
            //     circleHide.addEventListener("click", function () {
            //         appInfo.panelInfo.stagePanelInfo.addRightScore();
            //     });
            // }
            container.addChild(circleHide);
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
        container.addChild(leftScoreLabel);
        container.addChild(rightScoreLabel);
        ///time label---------------------------------------------------
        var timeLabel = new createjs.Text("99:99", "30px Arial", "#a2a2a2");
        timeLabel.x = 520;
        timeLabel.y = 90;
        cmd.on(CommandId.toggleTimer, function () {
            if (_this.timerId) {
                clearInterval(_this.timerId);
                // $("#btnToggleTime").val("开始");
                _this.timerId = 0;
            }
            else {
                _this.timerId = setInterval(function () {
                    _this.time++;
                    timeLabel.text = _this.formatSecond(_this.time);
                }, 1000);
            }
        });
        cmd.on(CommandId.resetTimer, function () {
            //$("#btnResetTime").on(MouseEvt.CLICK, ()=> {
            _this.time = 0;
            timeLabel.text = _this.formatSecond(_this.time);
        });
        this.timeLabel = timeLabel;
        container.addChild(timeLabel);
        if (!this.isClient) {
            var btnLeft = this.newBtn(function () {
                appInfo.panelInfo.stagePanelInfo.addLeftScore();
            });
            btnLeft.x = 450;
            btnLeft.y = 5;
            container.addChild(btnLeft);
            var btnLeft = this.newBtn(function () {
                appInfo.panelInfo.stagePanelInfo.addRightScore();
            });
            btnLeft.x = 650;
            btnLeft.y = 5;
            container.addChild(btnLeft);
        }
        if (param) {
            this.setLeftScore(param.leftScore);
            this.setRightScore(param.rightScore);
            this.setTime(param.time, param.state);
        }
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
var appInfo = null;
var Client = (function () {
    function Client(pid) {
        this.pid = pid;
        this.initWsClient(pid);
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
                    _this.panel = new TopPanelView(_this.initCanvas(), true);
                    _this.panel.init(info.param);
                    console.log("new panel");
                }
            }
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
