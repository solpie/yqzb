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
var fs = require('fs');
function readFile(file, options, callback) {
    if (callback == null) {
        callback = options;
        options = {};
    }
    fs.readFile(file, options, function (err, data) {
        if (err)
            return callback(err);
        var obj;
        try {
            obj = JSON.parse(data, options ? options.reviver : null);
        }
        catch (err2) {
            return callback(err2);
        }
        callback(null, obj);
    });
}
function readFileSync(file, options) {
    options = options || {};
    if (typeof options === 'string') {
        options = { encoding: options };
    }
    var shouldThrow = 'throws' in options ? options.throw : true;
    if (shouldThrow) {
        return JSON.parse(fs.readFileSync(file, options), options.reviver);
    }
    else {
        try {
            return JSON.parse(fs.readFileSync(file, options), options.reviver);
        }
        catch (err) {
            return null;
        }
    }
}
function writeFile(file, obj, options, callback) {
    if (callback == null) {
        callback = options;
        options = {};
    }
    var spaces = typeof options === 'object' && options !== null
        ? 'spaces' in options
            ? options.spaces : this.spaces
        : this.spaces;
    var str = '';
    try {
        str = JSON.stringify(obj, options ? options.replacer : null, spaces) + '\n';
    }
    catch (err) {
        if (callback)
            return callback(err, null);
    }
    fs.writeFile(file, str, options, callback);
}
function writeFileSync(file, obj, options) {
    options = options || {};
    var spaces = typeof options === 'object' && options !== null
        ? 'spaces' in options
            ? options.spaces : this.spaces
        : this.spaces;
    var str = JSON.stringify(obj, options.replacer, spaces) + '\n';
    // not sure if fs.writeFileSync returns anything, but just in case
    return fs.writeFileSync(file, str, options);
}
var jsonfile = {
    spaces: null,
    readFile: readFile,
    readFileSync: readFileSync,
    writeFile: writeFile,
    writeFileSync: writeFileSync
};
//module.exports = jsonfile; 
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
    EventDispatcher.prototype.emit = function (type, param, broadcastId) {
        if (param === void 0) { param = null; }
        if (broadcastId === void 0) { broadcastId = null; }
        if (this._func[type]) {
            for (var i = 0; i < this._func[type].length; ++i) {
                var f = this._func[type][i];
                if (f)
                    f.func(param);
            }
        }
        if (this.broadcast && broadcastId)
            this.broadcast(broadcastId, type, param);
    };
    EventDispatcher.prototype.proxy = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i - 0] = arguments[_i];
        }
        throw new Error("no proxy method!!!");
    };
    ;
    EventDispatcher.prototype.broadcast = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i - 0] = arguments[_i];
        }
        throw new Error("no broadcast method!!!");
    };
    ;
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
 * Created by toramisu on 2016/5/12.
 */
var PlayerInfo = (function () {
    function PlayerInfo() {
    }
    PlayerInfo.getPlayerInfo = function (pid) {
        var playerInfo = new PlayerInfo();
        return playerInfo;
    };
    PlayerInfo.prototype.getStyleIcon = function () {
        var path = '/img/icon/';
        if (this.style == 1) {
            path += 'feng.png';
        }
        else if (this.style == 2) {
            path += 'huo.png';
        }
        else if (this.style == 3) {
            path += 'shan.png';
        }
        else if (this.style == 4) {
            path += 'lin.png';
        }
        return path;
    };
    return PlayerInfo;
}());
/// <reference path="../../event/ActEvent.ts"/>
/// <reference path="../../model/PlayerInfo.ts"/>
var PanelInfo = (function () {
    function PanelInfo() {
        this.stage = new StagePanelInfo(PanelId.stagePanel);
        this.player = new PlayerPanelInfo(PanelId.playerPanel);
        this.win = new WinPanelInfo(PanelId.winPanel);
    }
    return PanelInfo;
}());
var BasePanelInfo = (function (_super) {
    __extends(BasePanelInfo, _super);
    function BasePanelInfo(pid) {
        _super.call(this);
        this.pid = pid;
    }
    return BasePanelInfo;
}(EventDispatcher));
var PlayerPanelInfo = (function (_super) {
    __extends(PlayerPanelInfo, _super);
    function PlayerPanelInfo() {
        _super.apply(this, arguments);
        this.playerInfo = new PlayerInfo();
    }
    // playerInfoArr:Array<PlayerInfo> = [];
    PlayerPanelInfo.prototype.getInfo = function () {
        this.playerInfo.name = "tmac";
        return {
            playerInfo: this.playerInfo
        };
    };
    return PlayerPanelInfo;
}(BasePanelInfo));
var WinPanelInfo = (function (_super) {
    __extends(WinPanelInfo, _super);
    function WinPanelInfo() {
        _super.apply(this, arguments);
        this.playerInfoArr = [];
    }
    WinPanelInfo.prototype.getInfo = function () {
        return {
            playerInfoArr: this.playerInfoArr
        };
    };
    return WinPanelInfo;
}(BasePanelInfo));
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
    StagePanelInfo.prototype.getInfo = function () {
        return {
            leftScore: this.leftScore,
            rightScore: this.rightScore,
            time: this.time,
            state: this.timerState
        };
    };
    StagePanelInfo.prototype.addLeftScore = function () {
        this.leftScore = (this.leftScore + 1) % (this.winScore + 1);
        // this.broadcast(CommandId.addLeftScore, this.leftScore);
        cmd.emit(CommandId.addLeftScore, this.leftScore, this.pid);
    };
    StagePanelInfo.prototype.addRightScore = function () {
        this.rightScore = (this.rightScore + 1) % (this.winScore + 1);
        cmd.emit(CommandId.addRightScore, this.rightScore, this.pid);
    };
    StagePanelInfo.prototype.toggleTimer = function () {
        cmd.emit(CommandId.toggleTimer, null, this.pid);
    };
    StagePanelInfo.prototype.resetTimer = function () {
        cmd.emit(CommandId.resetTimer, null, this.pid);
    };
    StagePanelInfo.prototype.fadeOut = function () {
        cmd.emit(CommandId.stageFadeOut, null, this.pid);
    };
    StagePanelInfo.prototype.fadeIn = function () {
        cmd.emit(CommandId.stageFadeIn, null, this.pid);
    };
    StagePanelInfo.prototype.playerScore = function () {
        cmd.emit(CommandId.playerScore, null, this.pid);
    };
    return StagePanelInfo;
}(BasePanelInfo));
/**
 * Created by toramisu on 2016/5/9.
 */
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../server/models/PanelInfo.ts"/>
var AppInfo = (function (_super) {
    __extends(AppInfo, _super);
    function AppInfo() {
        _super.call(this);
        console.log("");
        this.panel = new PanelInfo();
    }
    return AppInfo;
}(EventDispatcher));
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
    CommandId[CommandId["stageFadeOut"] = 100013] = "stageFadeOut";
    CommandId[CommandId["cs_fadeOut"] = 100014] = "cs_fadeOut";
    CommandId[CommandId["playerScore"] = 100015] = "playerScore";
    CommandId[CommandId["cs_playerScore"] = 100016] = "cs_playerScore";
    CommandId[CommandId["stageFadeIn"] = 100017] = "stageFadeIn";
    CommandId[CommandId["cs_stageFadeIn"] = 100018] = "cs_stageFadeIn";
    CommandId[CommandId["updateLeftTeam"] = 100019] = "updateLeftTeam";
    CommandId[CommandId["updateRightTeam"] = 100020] = "updateRightTeam";
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
/// <reference path="JQuery.ts"/>
/// <reference path="libs/createjs/easeljs.d.ts"/>
/// <reference path="libs/createjs/createjs.d.ts"/>
/// <reference path="libs/createjs/createjs-lib.d.ts"/>
/// <reference path="libs/createjs/tweenjs.d.ts"/>
var ElmId$ = {
    buttonAddLeftScore: "#btnAddLeftScore",
    buttonAddRightScore: "#btnAddRightScore"
};
var PanelId = {
    stagePanel: 'stage',
    winPanel: 'win',
    playerPanel: 'player'
};
/// <reference path="../Model/appInfo.ts"/>
/// <reference path="../Model/Command.ts"/>
/// <reference path="../Model/ElemID.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../lib.ts"/>
var BaseView = (function () {
    function BaseView(stage, isOp) {
        this.isOp = false;
        this.stage = stage;
        this.isOp = isOp;
    }
    BaseView.prototype.init = function (param) {
        console.log("init panel");
        this.ctn = new createjs.Container();
    };
    BaseView.prototype.show = function () {
    };
    BaseView.prototype.hide = function () {
    };
    BaseView.prototype.newBtn = function (func, text) {
        var ctn = new createjs.Container();
        var btn = new createjs.Shape();
        var btnWidth = 75 * 1.5, btnHeight = 30 * 1.5;
        btn.graphics
            .beginFill("#3c3c3c")
            .drawRect(0, 0, btnWidth, btnHeight);
        btn.addEventListener("click", func);
        // btn.addEventListener("mousedown", func);
        ctn.addChild(btn);
        if (text) {
            var txt = new createjs.Text(text, "24px Arial", "#e2e2e2");
            txt.x = (btnWidth - txt.getMeasuredWidth()) * .5;
            txt.y = (btnHeight - txt.getMeasuredHeight()) * .5 - 5;
            txt.mouseEnabled = false;
            ctn.addChild(txt);
        }
        return ctn;
    };
    return BaseView;
}());
/// <reference path="../../view/BaseView.ts"/>
var StagePanelView = (function (_super) {
    __extends(StagePanelView, _super);
    function StagePanelView(stage, isOp) {
        _super.call(this, stage, isOp);
        // if (!this.isClient)
        //     this.init(null);
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
        cmd.on(CommandId.stageFadeOut, function () {
            createjs.Tween.get(_this.ctn).to({ y: -100, alpha: .2 }, 200);
        });
        cmd.on(CommandId.stageFadeIn, function () {
            createjs.Tween.get(_this.ctn).to({ y: 0, alpha: 1 }, 200);
        });
        var isBusy = false;
        cmd.on(CommandId.playerScore, function () {
            if (!isBusy) {
                isBusy = true;
                createjs.Tween.get(_this.scoreCtn)
                    .to({ x: 1080, alpha: 1 }, 100)
                    .wait(3000)
                    .to({ y: 150, alpha: 0 }, 200)
                    .call(function () {
                    _this.scoreCtn.x = 800;
                    _this.scoreCtn.y = 200;
                    isBusy = false;
                });
            }
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
        _super.prototype.init.call(this, param);
        var ctn = this.ctn;
        this.stage.addChild(ctn);
        var bg = new createjs.Bitmap("/img/panelTop.png");
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
        /// score panel------------------------------------------------------
        this.scoreCtn = new createjs.Container();
        // var bg1 = new createjs.Shape();
        // bg1.graphics.beginFill("#105386");
        // bg1.graphics.drawRect(0, 0, 200, 70);
        // // bg1.graphics.beginLinearGradientFill(['#105386',''])
        // bg1.graphics.beginFill("#ffff00");
        // bg1.graphics.drawRect(128, 3, 64, 64);
        // bg1.alpha = .7;
        var box = new createjs.Shape();
        box.graphics.beginLinearGradientFill(["rgba(11, 80, 125, 0)", "#105386"], [0, .7], 0, 0, 200, 0);
        // box.graphics.beginLinearGradientFill(["rgba(255, 0, 0, 0)","#105386" ], [0, .7], 0, 0, 200, 0);
        box.graphics.drawRect(0, 0, 200, 70);
        box.graphics.endFill();
        box.graphics.beginFill("#ffff00");
        box.graphics.drawRect(128, 3, 64, 64);
        box.cache(0, 0, 200, 70);
        box.alpha = .8;
        this.scoreCtn.addChild(box);
        // this.scoreCtn.addChild(bg1);
        var avatar = new createjs.Bitmap("/img/player/p1.png");
        avatar.x = 130;
        avatar.y = 5;
        this.scoreCtn.addChild(avatar);
        this.scoreCtn.alpha = 0;
        this.scoreCtn.x = 800;
        this.scoreCtn.y = 200;
        avatar.addEventListener('click', function () {
            console.log("click score");
        });
        ctn.addChild(this.scoreCtn);
        //op panel-------------------------------------------------------
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
            var btn = this.newBtn(function () {
                cmd.proxy(CommandId.cs_fadeOut);
            }, "fadeOut");
            btn.x = 520;
            btn.y = 200;
            // btn.alpha = .5;
            ctn.addChild(btn);
            var btn = this.newBtn(function () {
                cmd.proxy(CommandId.cs_stageFadeIn);
            }, "fadeIn");
            btn.x = 520;
            btn.y = 150;
            // btn.alpha = .5;
            ctn.addChild(btn);
            var btn = this.newBtn(function () {
                cmd.proxy(CommandId.cs_playerScore);
            }, "score");
            btn.x = 820;
            btn.y = 150;
            // btn.alpha = .5;
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
var Container = createjs.Container;
var TrackerView = (function (_super) {
    __extends(TrackerView, _super);
    function TrackerView(stage, isClient) {
        var _this = this;
        _super.call(this, stage, false);
        this.init();
        cmd.on(CommandId.toggleTracker, function () {
            if (_this.tracker.parent)
                _this.tracker.parent.removeChild(_this.tracker);
            else
                _this.stage.addChildAt(_this.tracker, 1);
        });
        appInfo.on(MouseEvt.MOVE, function () {
            if (_this.tracker.visible) {
                _this.tracker.x = appInfo.mouseX - 100;
                _this.tracker.y = appInfo.mouseY - 300;
            }
            else {
            }
        });
        var isRolling = false;
        cmd.on(CommandId.toggleBallRolling, function () {
            if (!isRolling) {
                isRolling = true;
                createjs.Tween.get(_this.ballCtn, { loop: false }, true)
                    .to({ rotation: 5 * 360 }, 200, createjs.Ease.circInOut)
                    .call(function () {
                    _this.ballCtn.rotation = 0;
                    isRolling = false;
                });
            }
        });
    }
    TrackerView.prototype.init = function () {
        //var sp = new createjs.
        var tracker = new createjs.Container();
        this.tracker = tracker;
        //this.stage.addChild(tracker);
        var bg = new createjs.Bitmap("img/trackBg.png");
        tracker.addChild(bg);
        tracker.x = 300;
        tracker.y = 300;
        tracker.scaleX = tracker.scaleY = .5;
        var ballCtn = new createjs.Container();
        ballCtn.x = 80 + 29 * 2;
        ballCtn.y = 80 + 116 * 2;
        tracker.addChild(ballCtn);
        var ball = new createjs.Bitmap("img/trackBall.png");
        ball.x = -39;
        ball.y = -35;
        ballCtn.addChild(ball);
        this.ballCtn = ballCtn;
        ////
        // var video = document.getElementById('camFeed');
        // var canvas = document.getElementById('camCanvas');
        // var context = canvas.getContext('2d');
        //
        // var tracker1 = new tracking.ObjectTracker('face');
        // tracker1.setInitialScale(4);
        // tracker1.setStepSize(2);
        // tracker1.setEdgesDensity(0.1);
        //
        // tracking.track('#camFeed', tracker1, { camera: true });
        //
        // tracker1.on('track', function(event) {
        //     context.clearRect(0, 0, canvas.width, canvas.height);
        //
        //     event.data.forEach(function(rect) {
        //         context.strokeStyle = '#a64ceb';
        //         context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        //         context.font = '11px Helvetica';
        //         context.fillStyle = "#fff";
        //         context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
        //         context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        //     });
        // });
    };
    return TrackerView;
}(BaseView));
/**
 * Created by toramisu on 2016/5/9.
 */
/// <reference path="../lib.ts"/>
/// <reference path="../server/views/StagePanelView.ts"/>
/// <reference path="../server/views/TrackerView.ts"/>
var Stage = createjs.Stage;
var ServerView = (function () {
    function ServerView() {
        //this.canvasEl = document.getElementById("stage");
        //this.canvasEl.setAttribute("width", 800 + "");
        //this.canvasEl.setAttribute("height", 300 + "");
        //this.ctx = this.canvasEl.getContext("2d");
        /////////draw bar
        //this._fillRect("#ffff00", 0, 0, 800, 300);
        //this.test()
        this.stageWidth = 1200;
        this.stageHeight = 800;
        ////createjs
        // this.canvas = document.getElementById("stage");
        // this.canvas.setAttribute("width", this.stageWidth + "");
        // this.canvas.setAttribute("height", this.stageHeight + "");
        // this.stage = new createjs.Stage(this.canvas);
        // this.stage.autoClear = true;
        //stage bg
        //var bgRed = new createjs.Shape();
        //bgRed.graphics.beginFill("#ff0000");
        //bgRed.graphics.beginFill("#2b2b2b");
        //bgRed.graphics.drawRect(0, 0, this.stageWidth, this.stageHeight);
        //bgRed.graphics.endFill();
        //this.stage.addChild(bgRed);
        //add mod
        // this.panelView = new StagePanelView(this.stage, false, true);
        // this.trackerView = new TrackerView(this.stage, false,true);
        ////avatar panel
        //var bgAvatar = new createjs.Shape();
        //bgAvatar.graphics.beginFill("#cccccc");
        //bgAvatar.graphics.drawRect(5, 50, 115, 580);
        //bgAvatar.graphics.endFill();
        //this.stage.addChild(bgAvatar);
        //var images = [];
        //for (var i = 1; i <= 14; i++) {
        //    images.push("img/grossini_dance_" + (i < 10 ? ("0" + i) : i) + ".png");
        //}
        ////
        //var sheet = new createjs.SpriteSheet({
        //    images: images,
        //    frames: {width: 85, height: 121, regX: 42, regY: 60}
        //});
        ////需要设置每帧的宽高，注册点信息
        //var man = new createjs.Sprite(sheet);
        //man.framerate = 60 / 7;
        //man.x = 300;
        //man.y = 400;
        //man.play();
        //this.stage.addChild(man);
        ////  }
        //this.stage.update();
        // createjs.Ticker.setFPS(60);
        // createjs.Ticker.addEventListener("tick", ()=> {
        //     this.stage.update(event);
        // });
    }
    return ServerView;
}());
var fs = require('fs');
var Stream = require('stream');
var zlib = require('zlib');
//var data = fs.read('c:/test.xml');
function walk(path) {
    var fileArr = [];
    var dirArr = fs.readdirSync(path);
    dirArr.forEach(function (item) {
        if (fs.statSync(path + '/' + item).isDirectory()) {
        }
        else {
            var filename = path + '/' + item;
            fileArr.push({ filename: filename });
            console.log("file:", filename);
        }
    });
    return fileArr;
}
//walk('D:/projects/linAnil/test/test10');
//fs.mkdir("c:a", function (err) {
//    if (!err) {
//        console.log("sus");
//    } else {
//        console.log("err");
//    }
//});
//console.log('main',data);
////////////// path
var M_path = require("path");
////////////// macro
var isdef = function (val) {
    return val != undefined;
};
var prop = function (obj, paramName, v, callback) {
    if (isdef(v)) {
        obj[paramName] = v;
        if (callback)
            callback();
    }
    else
        return obj[paramName];
};
var writeBuffer = function (path, buffer, callback) {
    fs.open(path, 'w', null, function (err, fd) {
        if (err) {
            throw err;
        }
        fs.write(fd, buffer, 0, buffer.length, null, function (err) {
            if (err) {
                throw err;
            }
            fs.close(fd, function () {
                callback();
            });
        });
    });
};
/// <reference path="../Node.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../JQuery.ts"/>
var gui = require('nw.gui');
var win = gui.Window.get();
var WindowView = (function () {
    function WindowView() {
        this.isMaximize = false;
        // $("#btnClose").on(MouseEvt.CLICK, function () {
        //     win.close();
        // });
        // $("#btnDbg").on(MouseEvt.CLICK, function () {
        //     win.showDevTools('', true);
        // });
        ///dashboard
        //var win = gui.Window.open ('panel.html', {
        //    position: 'center',
        //    toolbar: false,
        //    width: 901,
        //    height: 523
        //});
        //
        //default op
        var op = gui.Window.open('http://localhost/panel/stage/op', {
            position: 'center',
            toolbar: false,
            width: 1280,
            height: 523
        });
        //win.on ('loaded', function () {
        //    // the native onload event has just occurred
        //    var doc = win.window.document;
        //    var getElmById = function (elmId) {
        //        return doc.getElementById(elmId);
        //    };
        //    var addBtnClick = function (elmId,func) {
        //        getElmById(elmId).onclick = func;
        //    };
        //    ///
        //    addBtnClick("btnAddLeftScore", () => {
        //        cmd.emit(CommandId.addLeftScore);
        //    });
        //    addBtnClick("btnAddRightScore", () => {
        //        cmd.emit(CommandId.addRightScore);
        //    });
        //    addBtnClick("btnToggleTime", () => {
        //        cmd.emit(CommandId.toggleTimer);
        //    });
        //    addBtnClick("btnResetTime", () => {
        //        cmd.emit(CommandId.resetTimer);
        //    });
        //});
        //$("#btnMin").on(MouseEvt.CLICK, function () {
        //    win.minimize();
        //});
        //$("#btnMax").on(MouseEvt.CLICK, function () {
        //    if (this.isMaximize) {
        //        win.unmaximize();
        //        this.isMaximize = false;
        //    }
        //    else {
        //        win.maximize();
        //        this.isMaximize = true;
        //    }
        //});
    }
    return WindowView;
}());
var KeyInput = (function () {
    function KeyInput() {
    }
    KeyInput.onKeyDown = function (e) {
        var key = e.keyCode;
        var isCtrl = e.ctrlKey;
        var isShift = e.shiftKey;
        var isAlt = e.altKey;
        if (Keys.ESC(key)) {
            KeyInput.isBlock = false;
        }
        if (KeyInput.isBlock) {
            console.log(this, "KeyInput Block");
            return;
        }
        if (Keys.Char(key, "F")) {
            console.log("F");
            cmd.emit(CommandId.toggleTracker);
        }
        else if (Keys.Char(key, "D")) {
        }
        else if (Keys.Char(key, "R")) {
            cmd.emit(CommandId.toggleBallRolling);
        }
        else if (Keys.Space(key)) {
        }
        else if (Keys.Char(key, "\r")) {
        }
        else if (Keys.Char(key, "O") && isCtrl) {
        }
        else if (key == 123) {
            win.showDevTools();
        }
        else if (Keys.Char(key, "S") && isCtrl) {
        }
        else if (Keys.GraveAccent(key)) {
            KeyInput.isBlock = true;
        }
    };
    return KeyInput;
}());
/**
 * Created by toramisu on 2016/5/9.
 */
/// <reference path="ServerView.ts"/>
/// <reference path="WinView.ts"/>
/// <reference path="../server/views/StagePanelView.ts"/>
/// <reference path="KeyInput.ts"/>
/// <reference path="../JQuery.ts"/>
var Keys = {
    GraveAccent: function (k) {
        return k == 192;
    },
    Space: function (k) {
        return k == 32;
    },
    ESC: function (k) {
        return k == 27;
    },
    Char: function (key, c) {
        return key == c.charCodeAt(0);
    }
};
var YuanqiTvView = (function () {
    function YuanqiTvView(appModel) {
        var _this = this;
        this.appInfo = appModel;
        console.log("dd");
        document.onmousemove = function (e) {
            _this.appInfo.mouseX = e.clientX;
            _this.appInfo.mouseY = e.clientY;
            _this.appInfo.emit(MouseEvt.MOVE);
        };
        document.onmouseup = function () {
            _this.appInfo.emit(MouseEvt.UP);
        };
        document.onkeydown = KeyInput.onKeyDown;
        // function initCamera() {
        //     if (navigator.webkitGetUserMedia) {
        //         navigator.webkitGetUserMedia({video: true}, onSuccess, onFail);
        //     }
        //     else {
        //         alert('webRTC not available');
        //     }
        // }
        //
        // function onSuccess(stream) {
        //     document.getElementById('camFeed').src = webkitURL.createObjectURL(stream);
        // }
        //
        // function onFail() {
        //     alert('could not connect stream');
        // }
        // initCamera();
    }
    YuanqiTvView.prototype.run = function () {
        this.winView = new WindowView();
        // this.serverView = new ServerView();
        console.log("run");
    };
    return YuanqiTvView;
}());
var serverConf = {
    host: "localhost",
    port: 8086
};
/**
 * Created by toramisu on 2016/5/13.
 */
/// <reference path="Config.ts"/>
var HttpServer = (function () {
    function HttpServer() {
        ///server
        var http = require('http');
        var path = require('path');
        var express = require('express');
        var app = express();
        // view engine setup
        app.set('views', "./ts/server/views/tpl");
        app.set('view engine', 'ejs');
        app.use(express.static("."));
        // respond with "hello world" when a GET request is made to the homepage
        app.get('/', function (req, res) {
            res.render('dashboard');
        });
        app.get('/panel/:id/:op', function (req, res) {
            var pid = req.params.id;
            var op = req.params.op;
            res.render('panel', { pid: pid, op: op, host: serverConf.host, port: serverConf.port });
        });
        app.post('/getPlayerInfo/:playerId', function (req, res) {
            var playerId = req.params.playerId;
            console.log("PlayerInfo ", playerId);
            var playerInfo;
            res.send(JSON.stringify({ playerInfo: playerInfo }));
        });
        // app.post('/getPlayerInfo/:playerId', function (req, res) {
        //     var playerId = req.params.playerId;
        //     console.log("PlayerInfo ", playerId);
        // });
        //setup the web server
        app.server = http.createServer(app);
        //listen up
        app.server.listen(80, function () {
            //and... we're live
            console.log('Server is running');
        });
        this.serverSend();
        this.handleOp();
    }
    HttpServer.prototype.handleOp = function () {
        cmd.on(CommandId.cs_addLeftScore, function () {
            appInfo.panel.stage.addLeftScore();
        });
        cmd.on(CommandId.cs_addRightScore, function () {
            appInfo.panel.stage.addRightScore();
        });
        cmd.on(CommandId.cs_toggleTimer, function () {
            appInfo.panel.stage.toggleTimer();
        });
        cmd.on(CommandId.cs_resetTimer, function () {
            appInfo.panel.stage.resetTimer();
        });
        cmd.on(CommandId.cs_fadeOut, function () {
            appInfo.panel.stage.fadeOut();
        });
        cmd.on(CommandId.cs_stageFadeIn, function () {
            appInfo.panel.stage.fadeIn();
        });
        cmd.on(CommandId.cs_playerScore, function () {
            appInfo.panel.stage.playerScore();
        });
    };
    HttpServer.prototype.serverSend = function () {
        var url = require('url');
        var WebSocketServer = require('ws').Server, wss = new WebSocketServer({ port: serverConf.port });
        wss.on('connection', function connection(wsClient) {
            var location = url.parse(wsClient.upgradeReq.url, true);
            // you might use location.query.access_token to authenticate or share sessions
            // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
            console.log(location);
            wsClient.on('message', function incoming(message) {
                console.log('client: ', message);
                var req = JSON.parse(message);
                if (req.req == "info") {
                    var pid = req.pid;
                    wsClient.pid = pid;
                    var info;
                    if (req.pid == PanelId.stagePanel)
                        info = appInfo.panel.stage.getInfo();
                    else if (pid == PanelId.playerPanel)
                        info = appInfo.panel.player.getInfo();
                    else if (pid == PanelId.winPanel)
                        info = appInfo.panel.win.getInfo();
                    wsClient.send(JSON.stringify({
                        res: "init",
                        param: info
                    }));
                }
                else if (req.req == "op") {
                    cmd.emit(req.param.type, req.param.param);
                }
            });
            wsClient.send(JSON.stringify({ res: "keep" }));
        });
        cmd.broadcast = function broadcastCmd(pid, cmdId, param) {
            var strData = JSON.stringify({ res: "cmd", pid: pid, cmd: cmdId, param: param });
            console.log("server:", strData);
            wss.clients.forEach(function each(client) {
                if (client.pid === pid)
                    client.send(strData);
            });
        };
    };
    return HttpServer;
}());
/// <reference path="JQuery.ts"/>
/// <reference path="utils/JSONFile.ts"/>
/// <reference path="model/AppInfo.ts"/>
/// <reference path="model/Command.ts"/>
/// <reference path="view/AppView.ts"/>
/// <reference path="server/HttpServer.ts"/>
var cmd = new Command();
var appInfo = new AppInfo();
var app;
var server;
jsonfile.readFile("config.json", null, function (err, confData) {
    serverConf.host = confData.server.host;
    serverConf.port = confData.server.wsPort;
    console.log("host:", serverConf.host, "ws port:", serverConf.port);
    server = new HttpServer();
});
appInfo.isServer = true;
$(function () {
    app = new YuanqiTvView(appInfo);
    app.run();
    //new Test(cmd,appInfo);
});
