var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// declare var Mustache:{
//     render(tpl:string, data?:Object);
// };
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
var serverConf = {
    host: "localhost",
    port: 8086
};
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
/// <reference path="../event/EventDispatcher.ts"/>
var CommandId;
(function (CommandId) {
    CommandId[CommandId["ShowConsoleWin"] = 100000] = "ShowConsoleWin";
    //
    CommandId[CommandId["toggleTracker"] = 100001] = "toggleTracker";
    CommandId[CommandId["toggleBallRolling"] = 100002] = "toggleBallRolling";
    //stage panel
    CommandId[CommandId["toggleTimer"] = 100003] = "toggleTimer";
    CommandId[CommandId["cs_toggleTimer"] = 100004] = "cs_toggleTimer";
    CommandId[CommandId["resetTimer"] = 100005] = "resetTimer";
    CommandId[CommandId["cs_resetTimer"] = 100006] = "cs_resetTimer";
    CommandId[CommandId["disableTracker"] = 100007] = "disableTracker";
    CommandId[CommandId["addLeftScore"] = 100008] = "addLeftScore";
    CommandId[CommandId["cs_addLeftScore"] = 100009] = "cs_addLeftScore";
    CommandId[CommandId["addRightScore"] = 100010] = "addRightScore";
    CommandId[CommandId["cs_addRightScore"] = 100011] = "cs_addRightScore";
    CommandId[CommandId["stageFadeOut"] = 100012] = "stageFadeOut";
    CommandId[CommandId["cs_fadeOut"] = 100013] = "cs_fadeOut";
    CommandId[CommandId["playerScore"] = 100014] = "playerScore";
    CommandId[CommandId["cs_playerScore"] = 100015] = "cs_playerScore";
    CommandId[CommandId["stageFadeIn"] = 100016] = "stageFadeIn";
    CommandId[CommandId["cs_stageFadeIn"] = 100017] = "cs_stageFadeIn";
    CommandId[CommandId["moveStagePanel"] = 100018] = "moveStagePanel";
    CommandId[CommandId["cs_moveStagePanel"] = 100019] = "cs_moveStagePanel";
    //
    CommandId[CommandId["updateLeftTeam"] = 100020] = "updateLeftTeam";
    CommandId[CommandId["updateRightTeam"] = 100021] = "updateRightTeam";
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
        // this.newCmd(CommandId.testSwapTrack, "test swap track");
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
var BaseInfo = (function () {
    function BaseInfo() {
    }
    return BaseInfo;
}());
/// <reference path="BaseInfo.ts"/>
var PlayerData = (function () {
    function PlayerData() {
    }
    return PlayerData;
}());
var PlayerInfo = (function (_super) {
    __extends(PlayerInfo, _super);
    function PlayerInfo() {
        _super.apply(this, arguments);
        this.playerData = new PlayerData();
    }
    PlayerInfo.prototype.id = function (val) {
        return prop(this.playerData, "id", val);
    };
    PlayerInfo.prototype.name = function (val) {
        return prop(this.playerData, "name", val);
    };
    PlayerInfo.prototype.eloScore = function (val) {
        return prop(this.playerData, "eloScore", val);
    };
    PlayerInfo.prototype.style = function (val) {
        return prop(this.playerData, "style", val);
    };
    PlayerInfo.prototype.avatar = function (val) {
        return prop(this.playerData, "avatar", val);
    };
    PlayerInfo.prototype.winpercent = function (val) {
        return prop(this.playerData, "winpercent", val);
    };
    PlayerInfo.prototype.getWinPercent = function () {
        return (this.winpercent() * 100).toFixed(1) + "%";
    };
    // static getPlayerInfo(pid) {
    //     jsonfile.readFile("data/" + pid + '.player', null, (err, data)=> {
    //         var playerInfo = new PlayerInfo();
    //         playerInfo = data;
    //         return playerInfo
    //     });
    // }
    PlayerInfo.prototype.getStyleIcon = function () {
        var path = '/img/icon/';
        if (this.style() == 1) {
            path += 'feng.png';
        }
        else if (this.style() == 2) {
            path += 'huo.png';
        }
        else if (this.style() == 3) {
            path += 'shan.png';
        }
        else if (this.style() == 4) {
            path += 'lin.png';
        }
        return path;
    };
    return PlayerInfo;
}(BaseInfo));
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
        this.playerInfo.name("tmac");
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
        this.winScore = 7;
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
            state: this.timerState,
            ctnXY: this.ctnXY
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
    StagePanelInfo.prototype.movePanel = function (param) {
        this.ctnXY = param;
        cmd.emit(CommandId.moveStagePanel, param, this.pid);
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
        this.panel = new PanelInfo();
    }
    return AppInfo;
}(EventDispatcher));
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
    BaseView.prototype.initOp = function () {
        console.log("init op");
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
    StagePanelView.prototype.initOp = function () {
        var _this = this;
        _super.prototype.initOp.call(this);
        var ctn = this.ctn;
        var fxCtn = this.fxCtn;
        var btnMove = this.newBtn(function () {
            _this.curSelectCtn = ctn;
            // this.moveCtnIdx = 0;
        }, "moveStage");
        fxCtn.addChild(btnMove);
        var btnMove = this.newBtn(function () {
            _this.curSelectCtn = _this.eventCtn;
            // this.moveCtnIdx = 1;
        }, "moveEvent");
        btnMove.y = 50;
        fxCtn.addChild(btnMove);
        var btnLeft = this.newBtn(function () {
            cmd.proxy(CommandId.cs_addLeftScore);
        });
        btnLeft.x = 450;
        btnLeft.y = 5;
        btnLeft.alpha = .5;
        fxCtn.addChild(btnLeft);
        var btnRight = this.newBtn(function () {
            cmd.proxy(CommandId.cs_addRightScore);
        });
        btnRight.x = 590;
        btnRight.y = 5;
        btnRight.alpha = .5;
        fxCtn.addChild(btnRight);
        var btn = this.newBtn(function () {
            cmd.proxy(CommandId.cs_toggleTimer);
        }, "toggle");
        btn.x = 450;
        btn.y = 100;
        btn.alpha = .5;
        fxCtn.addChild(btn);
        var btn = this.newBtn(function () {
            cmd.proxy(CommandId.cs_resetTimer);
        }, "reset");
        btn.x = 590;
        btn.y = 100;
        btn.alpha = .5;
        fxCtn.addChild(btn);
        var btn = this.newBtn(function () {
            cmd.proxy(CommandId.cs_fadeOut);
        }, "fadeOut");
        btn.x = 520;
        btn.y = 200;
        // btn.alpha = .5;
        fxCtn.addChild(btn);
        var btn = this.newBtn(function () {
            cmd.proxy(CommandId.cs_stageFadeIn);
        }, "fadeIn");
        btn.x = 520;
        btn.y = 150;
        // btn.alpha = .5;
        fxCtn.addChild(btn);
        var btn = this.newBtn(function () {
            cmd.proxy(CommandId.cs_playerScore);
        }, "score");
        btn.x = 820;
        btn.y = 150;
        // btn.alpha = .5;
        fxCtn.addChild(btn);
        //key
        document.onkeydown = function (e) {
            var key = e.keyCode;
            var isCtrl = e.ctrlKey;
            var isShift = e.shiftKey;
            var isAlt = e.altKey;
            console.log("key:", key);
            if (key == 38) {
                _this.curSelectCtn.y -= 1;
            }
            else if (key == 40) {
                _this.curSelectCtn.y += 1;
            }
            else if (key == 37) {
                _this.curSelectCtn.x -= 1;
            }
            else if (key == 39) {
                _this.curSelectCtn.x += 1;
            }
            cmd.proxy(CommandId.cs_moveStagePanel, {
                ctnX: _this.ctn.x,
                ctnY: _this.ctn.y,
                eventX: _this.eventCtn.x,
                eventY: _this.eventCtn.y
            });
        };
    };
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
            createjs.Tween.get(_this.fxCtn).to({ y: -100, alpha: .2 }, 200);
        });
        cmd.on(CommandId.stageFadeIn, function () {
            createjs.Tween.get(_this.fxCtn).to({ y: 0, alpha: 1 }, 200);
        });
        cmd.on(CommandId.moveStagePanel, function (param) {
            _this.setCtnXY(param);
        });
        var isBusy = false;
        cmd.on(CommandId.playerScore, function () {
            if (!isBusy) {
                isBusy = true;
                createjs.Tween.get(_this.fxEventCtn)
                    .to({ x: 1080, alpha: 1 }, 100)
                    .wait(3000)
                    .to({ y: 150, alpha: 0 }, 200)
                    .call(function () {
                    _this.fxEventCtn.x = 800;
                    _this.fxEventCtn.y = 200;
                    isBusy = false;
                });
            }
        });
    };
    StagePanelView.prototype.setLeftScore = function (leftScore) {
        this.leftScoreLabel.text = leftScore + "";
        var blink = 80;
        for (var i = 0; i < this.leftCircleArr.length; i++) {
            if (i < leftScore) {
                if (this.leftCircleArr[i].alpha == 0)
                    createjs.Tween.get(this.leftCircleArr[i])
                        .to({ alpha: 1 }, blink)
                        .to({ alpha: 0 }, blink)
                        .to({ alpha: 1 }, blink)
                        .to({ alpha: 0 }, blink)
                        .to({ alpha: 1 }, blink);
            }
            else {
                createjs.Tween.get(this.leftCircleArr[i]).to({ alpha: 0 }, 200);
            }
        }
        console.log(leftScore);
    };
    StagePanelView.prototype.setRightScore = function (rightScore) {
        var blink = 80;
        this.rightScoreLabel.text = rightScore + "";
        var len = this.rightCircleArr.length;
        for (var i = 0; i < len; i++) {
            if (i < rightScore) {
                if (this.rightCircleArr[len - 1 - i].alpha == 0)
                    createjs.Tween.get(this.rightCircleArr[len - 1 - i])
                        .to({ alpha: 1 }, blink)
                        .to({ alpha: 0 }, blink)
                        .to({ alpha: 1 }, blink)
                        .to({ alpha: 0 }, blink)
                        .to({ alpha: 1 }, blink);
            }
            else {
                createjs.Tween.get(this.rightCircleArr[len - 1 - i]).to({ alpha: 0 }, 200);
            }
        }
    };
    StagePanelView.prototype.setCtnXY = function (param) {
        this.ctn.x = param.ctnX;
        this.ctn.y = param.ctnY;
        this.eventCtn.x = param.eventX;
        this.eventCtn.y = param.eventY;
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
        var stageWidth = 1920;
        var stageHeight = 1080;
        var ctn = this.ctn;
        this.fxCtn = new createjs.Container();
        // this.stage.scaleX = 0.5;
        // this.stage.scaleY = 0.5;
        // this.ctn.scaleX = 0.5;
        // this.ctn.scaleY = 0.5;
        var ctnMove = this.fxCtn;
        this.stage.addChild(ctn);
        this.ctn.addChild(ctnMove);
        var bg = new createjs.Bitmap("/img/panel/stagescore.png");
        bg.x = (stageWidth - 658) * .5;
        bg.y = stageHeight - 107;
        ctnMove.addChild(bg);
        {
            //left score---------------------
            this.leftCircleArr = [];
            this.rightCircleArr = [];
            var px = 205 + 470;
            var py = stageHeight - 43;
            for (var i = 0; i < 7; i++) {
                var leftScoreBg = new createjs.Bitmap("/img/panel/leftScoreBg.png"); //694x132
                leftScoreBg.x = px + i * 20;
                leftScoreBg.y = py;
                ctnMove.addChild(leftScoreBg);
                var leftScore = new createjs.Bitmap("/img/panel/leftScore.png"); //694x132
                leftScore.x = leftScoreBg.x;
                leftScore.y = leftScoreBg.y;
                ctnMove.addChild(leftScore);
                this.leftCircleArr.push(leftScore);
            }
            //right score
            px = 1090;
            for (var i = 0; i < 7; i++) {
                var rightScoreBg = new createjs.Bitmap("/img/panel/rightScoreBg.png"); //694x132
                rightScoreBg.x = px + i * 20;
                rightScoreBg.y = py;
                ctnMove.addChild(rightScoreBg);
                var rightScore = new createjs.Bitmap("/img/panel/rightScore.png"); //694x132
                rightScore.x = rightScoreBg.x;
                rightScore.y = rightScoreBg.y;
                ctnMove.addChild(rightScore);
                this.rightCircleArr.push(rightScore);
            }
            var sheet = new createjs.SpriteSheet({
                animations: {
                    "0": 1,
                    "1": 2,
                    "2": 3,
                    "3": 4,
                    "4": 5,
                    "5": 6,
                    "6": 7,
                    "7": 8,
                    "8": 9,
                    "9": 0
                },
                images: ["/img/panel/scoreNum.png"],
                frames: [[0, 0, 40, 54],
                    [41, 0, 40, 54],
                    [0, 55, 40, 54],
                    [41, 55, 40, 54],
                    [82, 0, 40, 54],
                    [82, 55, 40, 54],
                    [123, 0, 40, 54],
                    [123, 55, 40, 54],
                    [0, 110, 40, 54],
                    [41, 110, 40, 54]]
            });
            var leftScoreNum = new createjs.BitmapText("0", sheet);
            leftScoreNum.letterSpacing = -2;
            leftScoreNum.x = bg.x + 230;
            leftScoreNum.y = bg.y + 37;
            this.leftScoreLabel = leftScoreNum;
            ctnMove.addChild(leftScoreNum);
            var rightScoreNum = new createjs.BitmapText("0", sheet);
            rightScoreNum.letterSpacing = -2;
            rightScoreNum.x = bg.x + 390;
            rightScoreNum.y = leftScoreNum.y;
            this.rightScoreLabel = rightScoreNum;
            ctnMove.addChild(rightScoreNum);
        }
        {
            var timeLabel = new createjs.Text("99:99", "28px Arial", "#e2e2e2");
            timeLabel.x = stageWidth * .5 - 32;
            timeLabel.y = stageHeight - 30;
            this.timeLabel = timeLabel;
            ctnMove.addChild(timeLabel);
        }
        {
            var leftOfs = 5;
            var bgLeft = new createjs.Bitmap("/img/panel/stageleft.png"); //694x132
            bgLeft.x = leftOfs;
            bgLeft.y = stageHeight - 132;
            ctnMove.addChild(bgLeft);
            for (var i = 0; i < 4; i++) {
                var leftAvatarBg = new createjs.Bitmap("/img/panel/leftAvatarBg.png"); //694x132
                leftAvatarBg.x = bgLeft.x + 15 + i * 150;
                leftAvatarBg.y = bgLeft.y + 6;
                ctnMove.addChild(leftAvatarBg);
                // var leftAvatarMask = new createjs.Shape();
                // // var leftMask =  new createjs.Bitmap("/img/panel/leftAvatarMask.png");//694x132
                //
                // leftAvatarMask.graphics.beginBitmapFill(img)
                //     .drawRect(0, 0, 217, 124);
                // leftAvatarMask.graphics.beginFill("#ccc")
                //     .drawRect(0,0,100,100);
                //
                // leftAvatarMask.x = bgLeft.x + 15 + i * 150;
                // leftAvatarMask.y = bgLeft.y + 6;
                // leftAvatarBg.mask = leftAvatarMask;
                // ctnMove.addChild(leftAvatarMask);
                // ctnMove.addChild(leftMask);
                var leftEloBg = new createjs.Bitmap("/img/panel/leftEloBg.png"); //694x132
                leftEloBg.x = leftAvatarBg.x + 25;
                leftEloBg.y = bgLeft.y + 70;
                ctnMove.addChild(leftEloBg);
                var leftEloLabel = new createjs.Text("1984", "18px Arial", "#e2e2e2");
                leftEloLabel.textAlign = "left";
                leftEloLabel.x = leftEloBg.x + 12;
                leftEloLabel.y = leftEloBg.y;
                ctnMove.addChild(leftEloLabel);
                var leftStyleIcon = new createjs.Bitmap("/img/panel/feng.png"); //694x132
                leftStyleIcon.x = leftAvatarBg.x + 120;
                leftStyleIcon.y = leftAvatarBg.y + 80;
                ctnMove.addChild(leftStyleIcon);
                var leftNameLabel = new createjs.Text("斯蒂芬库里", "bold 18px Arial", "#e2e2e2");
                leftNameLabel.textAlign = "left";
                leftNameLabel.x = leftAvatarBg.x + 20;
                leftNameLabel.y = leftAvatarBg.y + 90;
                ctnMove.addChild(leftNameLabel);
            }
            // };
            var bgRight = new createjs.Bitmap("/img/panel/stageright.png"); //694x132
            bgRight.x = stageWidth - 694 - leftOfs;
            bgRight.y = bgLeft.y;
            ctnMove.addChild(bgRight);
            for (var i = 0; i < 4; i++) {
                var rightAvatarBg = new createjs.Bitmap("/img/panel/rightAvatarBg.png"); //694x132
                rightAvatarBg.x = bgRight.x + 14 + i * 150;
                rightAvatarBg.y = bgRight.y + 6;
                ctnMove.addChild(rightAvatarBg);
                var rightEloBg = new createjs.Bitmap("/img/panel/rightEloBg.png"); //694x132
                rightEloBg.x = rightAvatarBg.x + 125;
                rightEloBg.y = bgRight.y + 70;
                ctnMove.addChild(rightEloBg);
                var rightEloLabel = new createjs.Text("99999", "18px Arial", "#e2e2e2");
                rightEloLabel.textAlign = "right";
                rightEloLabel.x = rightEloBg.x + 53;
                rightEloLabel.y = rightEloBg.y;
                ctnMove.addChild(rightEloLabel);
                var rightStyleIcon = new createjs.Bitmap("/img/panel/huo.png"); //694x132
                rightStyleIcon.x = rightAvatarBg.x + 60;
                rightStyleIcon.y = rightAvatarBg.y + 80;
                ctnMove.addChild(rightStyleIcon);
                var rightNameLabel = new createjs.Text("斯蒂芬库里", "bold 18px Arial", "#e2e2e2");
                rightNameLabel.textAlign = "right";
                rightNameLabel.x = rightAvatarBg.x + 195;
                rightNameLabel.y = rightAvatarBg.y + 90;
                ctnMove.addChild(rightNameLabel);
            }
        }
        {
            this.fxEventCtn = new createjs.Container();
            this.eventCtn = new createjs.Container();
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
            this.fxEventCtn.addChild(box);
            // this.fxEventCtn.addChild(bg1);
            var avatar = new createjs.Bitmap("/img/player/p1.png");
            avatar.x = 130;
            avatar.y = 5;
            this.fxEventCtn.addChild(avatar);
            this.fxEventCtn.alpha = 0;
            this.fxEventCtn.x = 800;
            this.fxEventCtn.y = 200;
            avatar.addEventListener('click', function () {
                console.log("click score");
            });
            this.eventCtn.addChild(this.fxEventCtn);
            ctnMove.addChild(this.eventCtn);
        }
        //op panel-------------------------------------------------------
        if (this.isOp) {
            this.initOp();
        }
        if (param) {
            this.setLeftScore(param.leftScore);
            this.setRightScore(param.rightScore);
            this.setTime(param.time, param.state);
            if (param.ctnXY)
                this.setCtnXY(param.ctnXY);
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
var PlayerView = (function () {
    function PlayerView() {
    }
    PlayerView.getPlayerCard = function (p) {
        var ctn = new createjs.Container();
        var bg = new createjs.Shape();
        bg.graphics.beginBitmapFill('#cccc').drawRect(0, 0, 90, 90);
        ctn.addChild(bg);
        var img = new createjs.Bitmap(p.avatar());
        ctn.addChild(img);
        var style = new createjs.Bitmap(p.getStyleIcon());
        style.scaleX = 1 / 16;
        style.scaleY = 1 / 16;
        style.x = 50;
        style.y = -16;
        ctn.addChild(style);
        var name = new createjs.Text(p.name + '', "30px Arial", "#a2a2a2");
        name.x = 5;
        name.y = 60;
        ctn.addChild(name);
        var eloScore = new createjs.Text(p.eloScore + '', "30px Arial", "#202020");
        eloScore.x = 5;
        eloScore.y = 95;
        ctn.addChild(eloScore);
        return ctn;
    };
    return PlayerView;
}());
/// <reference path="PlayerView.ts"/>
var PlayerPanelView = (function (_super) {
    __extends(PlayerPanelView, _super);
    function PlayerPanelView() {
        _super.apply(this, arguments);
    }
    // constructor(stage, isOp) {
    //     super(stage, isOp);
    // }
    PlayerPanelView.prototype.handle = function () {
    };
    PlayerPanelView.prototype.init = function (param) {
        _super.prototype.init.call(this, param);
        var ctn = new createjs.Container();
        this.ctn = ctn;
        this.stage.addChild(ctn);
        var bg = new createjs.Shape();
        bg.graphics.beginFill("#ccc").drawRoundRect(0, 0, 520, 180, 10);
        ctn.addChild(bg);
        // var playerName =new createjs.Text("0", "30px Arial", "#a2a2a2");
        // playerName.text = param.playerInfo.name;
        // ctn.addChild(playerName);
        var playerInfo = new PlayerInfo();
        playerInfo.name("tmac");
        playerInfo.avatar("/img/player/p1.png");
        playerInfo.eloScore(2431);
        playerInfo.style(1);
        var playerView = PlayerView.getPlayerCard(playerInfo);
        playerView.x = 15;
        playerView.y = 30;
        ctn.addChild(playerView);
        if (this.isOp) {
        }
    };
    return PlayerPanelView;
}(BaseView));
/// <reference path="../../view/BaseView.ts"/>
var WinPanelView = (function (_super) {
    __extends(WinPanelView, _super);
    function WinPanelView() {
        _super.apply(this, arguments);
    }
    // constructor(){
    //     super()
    // }
    WinPanelView.prototype.init = function (param) {
        _super.prototype.init.call(this, param);
        var ctn = this.ctn;
        var bg = new createjs.Shape();
        bg.graphics.beginFill("#ccc").drawRoundRect(0, 0, 600, 350, 10);
        ctn.addChild(bg);
        var playerArr = [];
        var playerInfo = new PlayerInfo();
        playerInfo.name("tmac");
        playerInfo.avatar("/img/player/p1.png");
        playerInfo.eloScore(2431);
        playerInfo.style(2);
        playerInfo.winpercent(.9501);
        playerArr.push(playerInfo);
        // var playerInfo = new PlayerInfo();
        // playerInfo.name = "curry";
        // playerInfo.avatar = "/img/player/p2.png";
        // playerInfo.eloScore = 2143;
        // playerInfo.style = 1;
        // playerInfo.winpercent = 15/42;
        // playerArr.push(playerInfo);
        // var playerInfo = new PlayerInfo();
        // playerInfo.name = "harden";
        // playerInfo.avatar = "/img/player/p3.png";
        // playerInfo.eloScore = 2431;
        // playerInfo.style = 4;
        // playerInfo.winpercent = .9501;
        // playerArr.push(playerInfo);
        // var playerInfo = new PlayerInfo();
        // playerInfo.name = "westbrook";
        // playerInfo.avatar = "/img/player/p4.png";
        // playerInfo.eloScore = 2143;
        // playerInfo.style = 3;
        // playerInfo.winpercent = 15/42;
        // playerArr.push(playerInfo);
        var px = 60;
        var py = 30;
        for (var i = 0; i < playerArr.length; i++) {
            var pInfo = playerArr[i];
            var playerView = PlayerView.getPlayerCard(pInfo);
            playerView.x = px + i * 120;
            playerView.y = py;
            var winpercent = new createjs.Text(pInfo.getWinPercent() + '', "24px Arial", "#a2a2a2");
            winpercent.y = 120;
            playerView.addChild(winpercent);
            ctn.addChild(playerView);
        }
        this.stage.addChild(ctn);
    };
    WinPanelView.prototype.renderChangeData = function () {
    };
    return WinPanelView;
}(BaseView));
/// <reference path="../lib.ts"/>
/// <reference path="Config.ts"/>
/// <reference path="../model/Command.ts"/>
/// <reference path="./views/StagePanelView.ts"/>
/// <reference path="./views/PlayerPanelView.ts"/>
/// <reference path="./views/WinPanelView.ts"/>
var cmd = new Command();
var appInfo = new AppInfo();
appInfo.isServer = false;
var Client = (function () {
    function Client(pid, isOB, host, port) {
        this.pid = pid;
        this.initWsClient(pid, host, port);
        this.isOB = isOB;
    }
    Client.prototype.initWsClient = function (pid, host, port) {
        var _this = this;
        var wsc = new WebSocket('ws://' + host + ':' + port);
        wsc.onopen = function () {
            wsc.send('{"req":"info","pid":"' + pid + '"}');
        };
        wsc.onmessage = function (event) {
            console.log(event.data);
            var info = JSON.parse(event.data);
            if (info.res == "cmd")
                cmd.emit(info.cmd, info.param);
            else if (info.res == "init") {
                _this.initPanel(pid, info.param);
            }
        };
        cmd.proxy = function (type, param) {
            wsc.send(JSON.stringify({ req: "op", pid: pid, param: { type: type, param: param } }));
        };
        appInfo.wsc = wsc;
    };
    Client.prototype.initPanel = function (pid, param) {
        var stage = this.initCanvas();
        var viewMap = {};
        viewMap[PanelId.stagePanel] = StagePanelView;
        viewMap[PanelId.playerPanel] = PlayerPanelView;
        viewMap[PanelId.winPanel] = WinPanelView;
        var view = viewMap[pid];
        // if (pid == PanelId.stagePanel) {
        //     view = StagePanelView;
        // }
        // else if (pid == PanelId.playerPanel) {
        //     view = PlayerPanelView;
        // }
        this.panel = new viewMap[pid](stage, this.isOB);
        this.panel.init(param);
    };
    Client.prototype.initCanvas = function () {
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
    };
    return Client;
}());
