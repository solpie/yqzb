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
var sortCompare = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
            return -1;
        }
        else if (val1 > val2) {
            return 1;
        }
        else {
            return 0;
        }
    };
};
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
    CommandId[CommandId["minLeftScore"] = 100012] = "minLeftScore";
    CommandId[CommandId["cs_minLeftScore"] = 100013] = "cs_minLeftScore";
    CommandId[CommandId["minRightScore"] = 100014] = "minRightScore";
    CommandId[CommandId["cs_minRightScore"] = 100015] = "cs_minRightScore";
    CommandId[CommandId["stageFadeOut"] = 100016] = "stageFadeOut";
    CommandId[CommandId["cs_fadeOut"] = 100017] = "cs_fadeOut";
    CommandId[CommandId["playerScore"] = 100018] = "playerScore";
    CommandId[CommandId["cs_playerScore"] = 100019] = "cs_playerScore";
    CommandId[CommandId["stageFadeIn"] = 100020] = "stageFadeIn";
    CommandId[CommandId["cs_stageFadeIn"] = 100021] = "cs_stageFadeIn";
    CommandId[CommandId["moveStagePanel"] = 100022] = "moveStagePanel";
    CommandId[CommandId["cs_moveStagePanel"] = 100023] = "cs_moveStagePanel";
    CommandId[CommandId["updatePlayer"] = 100024] = "updatePlayer";
    CommandId[CommandId["cs_updatePlayer"] = 100025] = "cs_updatePlayer";
    CommandId[CommandId["updatePlayerAll"] = 100026] = "updatePlayerAll";
    CommandId[CommandId["cs_updatePlayerAll"] = 100027] = "cs_updatePlayerAll";
    //-----------------win panel
    CommandId[CommandId["updatePlayerAllWin"] = 100028] = "updatePlayerAllWin";
    CommandId[CommandId["cs_updatePlayerAllWin"] = 100029] = "cs_updatePlayerAllWin";
    //
    CommandId[CommandId["updateLeftTeam"] = 100030] = "updateLeftTeam";
    CommandId[CommandId["updateRightTeam"] = 100031] = "updateRightTeam";
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
var obj2Class = function (obj, cls) {
    var c = new cls;
    for (var paramName in obj) {
        c[paramName] = obj[paramName];
    }
    return c;
};
var BaseInfo = (function () {
    function BaseInfo() {
    }
    return BaseInfo;
}());
/// <reference path="BaseInfo.ts"/>
var PlayerData = (function () {
    function PlayerData() {
        this.id = 0;
        this.name = '';
        this.eloScore = 0;
        this.style = 0; //风林火山 1 2 3 4
        this.avatar = "";
        this.height = 0;
        this.weight = 0;
        this.winpercent = 0; //  胜率  100/100.0%
        this.gameCount = 0; //场数
        this.dtScore = 0;
    }
    return PlayerData;
}());
var PlayerInfo = (function (_super) {
    __extends(PlayerInfo, _super);
    function PlayerInfo(playerData) {
        _super.call(this);
        this.playerData = new PlayerData();
        this.isRed = true;
        this.isMvp = false;
        if (playerData) {
            this.playerData = obj2Class(playerData, PlayerData);
        }
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
    PlayerInfo.prototype.dtScore = function (val) {
        return prop(this.playerData, "dtScore", val);
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
    PlayerInfo.prototype.gameCount = function (val) {
        return prop(this.playerData, "gameCount", val);
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
        var path = '/img/panel/';
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
    PlayerInfo.prototype.getWinStyleIcon = function () {
        var path = '/img/panel/';
        if (this.style() == 1) {
            path += 'fengWin.png';
        }
        else if (this.style() == 2) {
            path += 'huoWin.png';
        }
        else if (this.style() == 3) {
            path += 'shanWin.png';
        }
        else if (this.style() == 4) {
            path += 'linWin.png';
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
        this.playerInfoArr = new Array(4);
    }
    WinPanelInfo.prototype.getInfo = function () {
        return {
            playerInfoArr: this.playerInfoArr
        };
    };
    WinPanelInfo.prototype.updatePlayerAllWin = function (param) {
        for (var i = 0; i < param.length; i++) {
            var obj = param[i];
            this.playerInfoArr[obj.pos] = obj;
            console.log(this, "updatePlayer", JSON.stringify(obj), obj.pos, obj.isRed);
        }
        cmd.emit(CommandId.updatePlayerAllWin, param, this.pid);
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
        this.playerInfoArr = new Array(8);
    }
    StagePanelInfo.prototype.getInfo = function () {
        return {
            leftScore: this.leftScore,
            rightScore: this.rightScore,
            time: this.time,
            state: this.timerState,
            ctnXY: this.ctnXY,
            playerInfoArr: this.playerInfoArr
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
    StagePanelInfo.prototype.updatePlayer = function (param) {
        var pos = param.pos;
        param.playerInfo.pos = pos;
        this.playerInfoArr[pos] = param.playerInfo;
        console.log(this, "updatePlayer", JSON.stringify(param.playerInfo), param.playerInfo.pos);
        cmd.emit(CommandId.updatePlayer, param, this.pid);
    };
    StagePanelInfo.prototype.updatePlayerAll = function (param) {
        for (var i = 0; i < param.length; i++) {
            var obj = param[i];
            this.playerInfoArr[obj.pos] = obj.playerInfo;
            obj.playerInfo.pos = obj.pos;
            console.log(this, "updatePlayer", JSON.stringify(obj.playerInfo), obj.playerInfo.pos);
        }
        cmd.emit(CommandId.updatePlayerAll, param, this.pid);
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
    // wsc:any;
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
        this.stageWidth = 1920;
        this.stageHeight = 1080;
        this.isOp = false;
        this.stage = stage;
        this.isOp = isOp;
    }
    BaseView.prototype.init = function (param) {
        console.log("init panel");
        this.ctn = new createjs.Container();
    };
    BaseView.prototype.initOp = function () {
        $(".inputPanel").show();
    };
    BaseView.prototype.newBtn = function (func, text) {
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
    };
    return BaseView;
}());
/// <reference path="../../view/BaseView.ts"/>
var StagePanelView = (function (_super) {
    __extends(StagePanelView, _super);
    function StagePanelView(stage, isOp) {
        _super.call(this, stage, isOp);
        this.onServerBroadcast();
    }
    StagePanelView.prototype.initOp = function () {
        var _this = this;
        _super.prototype.initOp.call(this);
        var ctn = this.ctn;
        var fxCtn = this.fxCtn;
        //update player
        {
            $(".inputPanel").show();
            $(".btnUpdate").click(function (e) {
                var s = $(e.target).data("pos").toString();
                var pos = parseInt(s);
                var playerId = $($(".playerId")[pos]).val();
                console.log($(e.target).data("pos"), playerId);
                $.post("/getPlayerInfo/" + playerId, null, function (res) {
                    var data = JSON.parse(res);
                    cmd.proxy(CommandId.cs_updatePlayer, { playerInfo: data.playerInfo, pos: pos });
                    $($(".playerAvatar")[pos]).attr("src", data.playerInfo.avatar);
                });
            });
            $(".btnQuery").click(function (e) {
                var s = $(e.target).data("pos").toString();
                var pos = parseInt(s);
                var playerId = $($(".playerId")[pos]).val();
                console.log($(e.target).data("pos"), playerId);
                $.post("/getPlayerInfo/" + playerId, null, function (res) {
                    var data = JSON.parse(res);
                    $($(".playerAvatar")[pos]).attr("src", data.playerInfo.avatar);
                });
            });
            $("#btnUpdateAll").click(function (e) {
                var playerIdArr = [];
                for (var i = 0; i < 8; i++) {
                    var pos = i;
                    var playerId = $($(".playerId")[pos]).val();
                    if (playerId) {
                        playerIdArr.push({ playerId: playerId, pos: pos });
                    }
                }
                if (playerIdArr.length)
                    cmd.proxy(CommandId.cs_updatePlayerAll, playerIdArr);
            });
        }
        var btnMove = this.newBtn(function () {
            if (_this.curSelectCtn)
                _this.curSelectCtn = null;
            else
                _this.curSelectCtn = ctn;
        }, "moveStage");
        fxCtn.addChild(btnMove);
        var btnMove = this.newBtn(function () {
            if (_this.curSelectCtn)
                _this.curSelectCtn = null;
            else
                _this.curSelectCtn = _this.eventCtn;
        }, "moveEvent");
        btnMove.y = 100;
        fxCtn.addChild(btnMove);
        var btnLeft = this.newBtn(function () {
            cmd.proxy(CommandId.cs_addLeftScore);
        }, "addLeft");
        btnLeft.x = 20;
        btnLeft.y = 500;
        fxCtn.addChild(btnLeft);
        var btn = this.newBtn(function () {
            cmd.proxy(CommandId.cs_minLeftScore);
        }, "minLeft");
        btn.x = 300;
        btn.y = 500;
        fxCtn.addChild(btn);
        var btn = this.newBtn(function () {
            cmd.proxy(CommandId.cs_minRightScore);
        }, 'minRight');
        btn.x = 590;
        btn.y = 500;
        fxCtn.addChild(btn);
        var btnRight = this.newBtn(function () {
            cmd.proxy(CommandId.cs_addRightScore);
        }, 'addRight');
        btnRight.x = 850;
        btnRight.y = 500;
        fxCtn.addChild(btnRight);
        var btn = this.newBtn(function () {
            cmd.proxy(CommandId.cs_toggleTimer);
        }, "toggle");
        btn.x = 200;
        btn.y = 300;
        fxCtn.addChild(btn);
        var btn = this.newBtn(function () {
            cmd.proxy(CommandId.cs_resetTimer);
        }, "reset");
        btn.x = 590;
        btn.y = 300;
        fxCtn.addChild(btn);
        var btn = this.newBtn(function () {
            cmd.proxy(CommandId.cs_fadeOut);
        }, "fadeOut");
        btn.x = 520;
        btn.y = 200;
        fxCtn.addChild(btn);
        var btn = this.newBtn(function () {
            cmd.proxy(CommandId.cs_stageFadeIn);
        }, "fadeIn");
        btn.x = 520;
        btn.y = 100;
        fxCtn.addChild(btn);
        var btn = this.newBtn(function () {
            cmd.proxy(CommandId.cs_playerScore);
        }, "score");
        btn.x = 820;
        btn.y = 150;
        fxCtn.addChild(btn);
        //key
        document.onkeydown = function (e) {
            var key = e.keyCode;
            var isCtrl = e.ctrlKey;
            var isShift = e.shiftKey;
            var isAlt = e.altKey;
            console.log("key:", key);
            var isMove = false;
            if (key == 38) {
                _this.curSelectCtn.y -= 1;
                isMove = true;
            }
            else if (key == 40) {
                _this.curSelectCtn.y += 1;
                isMove = true;
            }
            else if (key == 37) {
                _this.curSelectCtn.x -= 1;
                isMove = true;
            }
            else if (key == 39) {
                _this.curSelectCtn.x += 1;
                isMove = true;
            }
            if (isMove)
                cmd.proxy(CommandId.cs_moveStagePanel, {
                    ctnX: _this.ctn.x,
                    ctnY: _this.ctn.y,
                    eventX: _this.eventCtn.x,
                    eventY: _this.eventCtn.y
                });
        };
    };
    StagePanelView.prototype.onServerBroadcast = function () {
        var _this = this;
        cmd.on(CommandId.updatePlayer, function (param) {
            var pos = param.pos;
            var playerData = param.playerInfo;
            _this.setPlayer(pos, playerData);
        });
        cmd.on(CommandId.updatePlayerAll, function (playerInfoArr) {
            var tweenCall = function (dt, pos, playerData) {
                createjs.Tween.get(_this).wait(dt).call(function () {
                    _this.setPlayer(pos, playerData);
                });
            };
            for (var i = 0; i < playerInfoArr.length; i++) {
                var playerInfo = playerInfoArr[i];
                var pos = playerInfo.pos;
                var playerData = playerInfo.playerInfo;
                tweenCall(i * 300, pos, playerData);
            }
        });
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
            createjs.Tween.get(_this.fxCtn).to({ y: 140, alpha: .2 }, 200);
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
        var len = this.leftCircleArr.length;
        for (var i = 0; i < this.leftCircleArr.length; i++) {
            if (i < leftScore) {
                if (this.leftCircleArr[len - 1 - i].alpha == 0)
                    this.blink(this.leftCircleArr[len - 1 - i]);
            }
            else {
                createjs.Tween.get(this.leftCircleArr[len - 1 - i]).to({ alpha: 0 }, 200);
            }
        }
        console.log(leftScore);
    };
    StagePanelView.prototype.blink = function (target) {
        var blink = 80;
        createjs.Tween.get(target)
            .to({ alpha: 1 }, blink)
            .to({ alpha: 0 }, blink)
            .to({ alpha: 1 }, blink)
            .to({ alpha: 0 }, blink)
            .to({ alpha: 1 }, blink);
    };
    StagePanelView.prototype.setRightScore = function (rightScore) {
        this.rightScoreLabel.text = rightScore + "";
        var len = this.rightCircleArr.length;
        for (var i = 0; i < len; i++) {
            if (i < rightScore) {
                if (this.rightCircleArr[i].alpha == 0)
                    this.blink(this.rightCircleArr[i]);
            }
            else {
                createjs.Tween.get(this.rightCircleArr[i]).to({ alpha: 0 }, 200);
            }
        }
    };
    StagePanelView.prototype.setPlayer = function (pos, playerData) {
        var playerInfo = new PlayerInfo(playerData);
        console.log("updatePlayer", pos, playerInfo);
        this.eloLabelArr[pos].text = playerInfo.eloScore();
        this.nameLabelArr[pos].text = playerInfo.name();
        var styleCtn = this.styleArr[pos];
        styleCtn.removeAllChildren();
        var styleIcon = new createjs.Bitmap(playerInfo.getStyleIcon());
        styleIcon.alpha = 0;
        styleCtn.addChild(styleIcon);
        this.blink(styleIcon);
        var avatarCtn = this.avatarArr[pos];
        avatarCtn.removeChildAt(1);
        var mask = avatarCtn.getChildAt(0);
        var avatar = new createjs.Bitmap(playerInfo.avatar());
        avatarCtn.addChild(avatar);
        avatar.mask = mask;
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
            this.eloLabelArr = [];
            this.nameLabelArr = [];
            this.avatarArr = [];
            this.styleArr = [];
            var leftOfs = 5;
            var bgLeft = new createjs.Bitmap("/img/panel/stageleft.png"); //694x132
            bgLeft.x = leftOfs;
            bgLeft.y = stageHeight - 132;
            ctnMove.addChild(bgLeft);
            for (var i = 0; i < 4; i++) {
                var leftAvatarBg = new createjs.Bitmap("/img/panel/leftAvatarBg.png"); //694x132
                leftAvatarBg.x = bgLeft.x + 15 + i * 150;
                leftAvatarBg.y = bgLeft.y + 6;
                var avatarCtn = new createjs.Container();
                avatarCtn.x = leftAvatarBg.x + 25;
                avatarCtn.y = leftAvatarBg.y + 9;
                var leftMask = new createjs.Shape();
                var sx = 44;
                leftMask.graphics.beginFill("#000000")
                    .moveTo(sx, 0)
                    .lineTo(0, 76)
                    .lineTo(180 - sx, 76)
                    .lineTo(180, 0)
                    .lineTo(sx, 0);
                var avatarBmp = new createjs.Bitmap("/img/player/p1.png");
                avatarBmp.mask = leftMask;
                avatarCtn.addChild(leftMask);
                avatarCtn.addChild(avatarBmp);
                this.avatarArr.push(avatarCtn);
                ctnMove.addChild(avatarCtn);
                ctnMove.addChild(leftAvatarBg);
                var leftEloBg = new createjs.Bitmap("/img/panel/leftEloBg.png"); //694x132
                leftEloBg.x = leftAvatarBg.x + 27;
                leftEloBg.y = bgLeft.y + 70;
                ctnMove.addChild(leftEloBg);
                var leftEloLabel = new createjs.Text("1984", "18px Arial", "#e2e2e2");
                leftEloLabel.textAlign = "left";
                leftEloLabel.x = leftEloBg.x + 12;
                leftEloLabel.y = leftEloBg.y + 3;
                this.eloLabelArr.push(leftEloLabel);
                ctnMove.addChild(leftEloLabel);
                var styleCtn = new createjs.Container();
                var leftStyleIcon = new createjs.Bitmap("/img/panel/feng.png"); //694x132
                styleCtn.x = leftAvatarBg.x + 120;
                styleCtn.y = leftAvatarBg.y + 80;
                styleCtn.addChild(leftStyleIcon);
                this.styleArr.push(styleCtn);
                ctnMove.addChild(styleCtn);
                var leftNameLabel = new createjs.Text("斯蒂芬库里", "bold 18px Arial", "#e2e2e2");
                leftNameLabel.textAlign = "left";
                leftNameLabel.x = leftAvatarBg.x + 20;
                leftNameLabel.y = leftAvatarBg.y + 90;
                this.nameLabelArr.push(leftNameLabel);
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
                var rightAvatarCtn = new createjs.Container();
                rightAvatarCtn.x = rightAvatarBg.x + 11;
                rightAvatarCtn.y = rightAvatarBg.y + 9;
                var rightMask = new createjs.Shape();
                var sx = 44;
                rightMask.graphics.beginFill("#000000")
                    .moveTo(0, 0)
                    .lineTo(sx, 76)
                    .lineTo(180, 76)
                    .lineTo(180 - sx, 0)
                    .lineTo(0, 0);
                var avatarBmp = new createjs.Bitmap("/img/player/p3.png");
                avatarBmp.mask = rightMask;
                rightAvatarCtn.addChild(rightMask);
                rightAvatarCtn.addChild(avatarBmp);
                this.avatarArr.push(rightAvatarCtn);
                ctnMove.addChild(rightAvatarCtn);
                ctnMove.addChild(rightAvatarBg);
                var rightEloBg = new createjs.Bitmap("/img/panel/rightEloBg.png"); //694x132
                rightEloBg.x = rightAvatarBg.x + 125;
                rightEloBg.y = bgRight.y + 70;
                ctnMove.addChild(rightEloBg);
                var rightEloLabel = new createjs.Text("99999", "18px Arial", "#e2e2e2");
                rightEloLabel.textAlign = "right";
                rightEloLabel.x = rightEloBg.x + 53;
                rightEloLabel.y = rightEloBg.y + 3;
                this.eloLabelArr.push(rightEloLabel);
                ctnMove.addChild(rightEloLabel);
                var styleCtn = new createjs.Container();
                var rightStyleIcon = new createjs.Bitmap("/img/panel/huo.png"); //694x132
                styleCtn.x = rightAvatarBg.x + 60;
                styleCtn.y = rightAvatarBg.y + 80;
                this.styleArr.push(styleCtn);
                styleCtn.addChild(rightStyleIcon);
                ctnMove.addChild(styleCtn);
                var rightNameLabel = new createjs.Text("斯蒂芬库里", "bold 18px Arial", "#e2e2e2");
                rightNameLabel.textAlign = "right";
                rightNameLabel.x = rightAvatarBg.x + 195;
                rightNameLabel.y = rightAvatarBg.y + 90;
                this.nameLabelArr.push(rightNameLabel);
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
            for (var i = 0; i < param.playerInfoArr.length; i++) {
                var obj = param.playerInfoArr[i];
                if (obj) {
                    this.setPlayer(obj.pos, obj);
                }
            }
            if (param.ctnXY)
                this.setCtnXY(param.ctnXY);
        }
        // var bmp = new createjs.Bitmap("/img/player/p1.png");
        // bmp.x = 0;
        // bmp.y = 0;
        // //创建遮罩
        // var leftMask = new createjs.Shape();
        // leftMask.graphics.beginFill("#000000")
        //     .moveTo(48, 0)
        //     .lineTo(0, 76)
        //     .lineTo(180 - 48, 76)
        //     .lineTo(180, 0)
        //     .lineTo(48, 0);
        // leftMask.x = 0;
        // leftMask.y = 0;
        // this.stage.addChild(bmp);
        // bmp.mask = leftMask;
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
    PlayerView.prototype.setPlayerInfo = function (playerInfo) {
    };
    ;
    PlayerView.prototype.getWinPlayerCard = function (p) {
        var isMvp = p.isMvp;
        var ctn = new createjs.Container();
        var avatar = new createjs.Bitmap(p.avatar());
        if (isMvp) {
            avatar.scaleX = avatar.scaleY = 1.5;
            avatar.x = (180 - 180 * 1.2) * .5;
            avatar.y = 45;
        }
        else {
            avatar.scaleX = avatar.scaleY = 1.2;
            avatar.x = (180 - 180 * 1.2) * .5;
            avatar.y = 50;
        }
        ctn.addChild(avatar);
        var bgPath = '/img/panel/playerBgWin';
        if (p.isRed)
            bgPath += "Red";
        else
            bgPath += "Blue";
        if (p.isMvp)
            bgPath += "Mvp";
        bgPath += '.png';
        var bg = new createjs.Bitmap(bgPath);
        if (p.isMvp) {
            bg.x = -192;
            bg.y = -135;
        }
        else {
            bg.x = -176;
            bg.y = -110;
        }
        ctn.addChild(bg);
        var col;
        if (p.isRed)
            col = "#e23f6b";
        else
            col = "#1ac3fa";
        var nameCol = "#ddd";
        if (isMvp)
            nameCol = "#f1c236";
        var name;
        if (isMvp)
            name = new createjs.Text(p.name(), "30px Arial", nameCol);
        else
            name = new createjs.Text(p.name(), "30px Arial", col);
        name.textAlign = 'center';
        name.x = 90;
        if (isMvp)
            name.x += 20;
        name.y = 185;
        ctn.addChild(name);
        this.nameLabel = name;
        var eloScore;
        eloScore = new createjs.Text(p.eloScore(), "bold 32px Arial", nameCol);
        eloScore.textAlign = 'center';
        eloScore.x = name.x;
        eloScore.y = 245;
        if (isMvp)
            eloScore.y += 30;
        ctn.addChild(eloScore);
        var eloScoreDt = new createjs.Text("+" + p.eloScore(), "12px Arial", col);
        eloScoreDt.textAlign = 'left';
        eloScoreDt.x = 140;
        eloScoreDt.y = 260;
        if (isMvp) {
            eloScoreDt.x += 30;
            eloScoreDt.y += 30;
        }
        ctn.addChild(eloScoreDt);
        var winpercent = new createjs.Text("胜率" + p.winpercent().toFixed(3) * 100 + "%", "18px Arial", col);
        winpercent.textAlign = 'center';
        winpercent.x = name.x;
        winpercent.y = 290;
        if (isMvp)
            winpercent.y += 35;
        ctn.addChild(winpercent);
        var gameCount = new createjs.Text("总场数" + p.gameCount(), "18px Arial", col);
        gameCount.textAlign = 'center';
        gameCount.x = name.x;
        gameCount.y = 320;
        if (isMvp)
            gameCount.y += 35;
        ctn.addChild(gameCount);
        var style = new createjs.Bitmap(p.getWinStyleIcon());
        style.x = 50;
        style.y = 340;
        if (isMvp) {
            style.x += 20;
            style.y += 45;
        }
        ctn.addChild(style);
        return ctn;
    };
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
        this.mvpPos = 0;
        this.isRed = true;
    }
    WinPanelView.prototype.init = function (param) {
        _super.prototype.init.call(this, param);
        var ctn = this.ctn;
        var bg = new createjs.Shape();
        bg.graphics.beginFill('#000').drawRect(0, 0, this.stageWidth, this.stageHeight);
        bg.alpha = .3;
        ctn.addChild(bg);
        var playerCtn = new createjs.Container();
        ctn.addChild(playerCtn);
        this.playerCtn = playerCtn;
        var playerArr = [];
        var playerInfo = new PlayerInfo();
        playerInfo.name("tmac");
        playerInfo.avatar("/img/player/p1.png");
        playerInfo.eloScore(2431);
        playerInfo.style(1);
        playerInfo.winpercent(.9501);
        playerArr.push(playerInfo);
        var playerInfo = new PlayerInfo();
        playerInfo.name("tmac");
        playerInfo.avatar("/img/player/p1.png");
        playerInfo.eloScore(2431);
        playerInfo.style(2);
        playerInfo.winpercent(.9501);
        playerArr.push(playerInfo);
        playerInfo.isMvp = true;
        var playerInfo = new PlayerInfo();
        playerInfo.name("tmac");
        playerInfo.avatar("/img/player/p1.png");
        playerInfo.eloScore(2431);
        playerInfo.style(3);
        playerInfo.winpercent(.9501);
        playerArr.push(playerInfo);
        var playerInfo = new PlayerInfo();
        playerInfo.name("tmac");
        playerInfo.avatar("/img/player/p1.png");
        playerInfo.eloScore(2431);
        playerInfo.style(4);
        playerInfo.winpercent(.9501);
        playerArr.push(playerInfo);
        this.setPlayerInfoArr(playerArr, false);
        this.stage.addChild(ctn);
        //===============
        if (this.isOp)
            this.initOp();
        this.onServerBroadcast();
        if (param) {
            this.setPlayerInfoArr(param.playerInfoArr, true);
        }
    };
    WinPanelView.prototype.setPlayerInfoArr = function (playerInfoArr, isPlayerData) {
        // this.ctn.removeAllChildren()
        this.playerCtn.removeAllChildren();
        var px = 60;
        var py = 30;
        var prePlayerIsMvp = false;
        playerInfoArr.sort(sortCompare('pos'));
        for (var i = 0; i < playerInfoArr.length; i++) {
            var pInfo;
            if (isPlayerData) {
                pInfo = new PlayerInfo(playerInfoArr[i]);
                pInfo.isMvp = playerInfoArr[i].isMvp;
                pInfo.isRed = playerInfoArr[i].isRed;
            }
            else
                pInfo = playerInfoArr[i];
            // pInfo.isMvp = (pInfo.pos == mvpPos);
            var playerView1 = new PlayerView();
            var playerView = playerView1.getWinPlayerCard(pInfo);
            playerView.x = px + i * 390;
            if (pInfo.isMvp)
                playerView.y = py - 30;
            else
                playerView.y = py;
            this.playerCtn.addChild(playerView);
            prePlayerIsMvp = pInfo.isMvp;
        }
        this.playerCtn.x = (this.stageWidth - 390 * 4) * .5;
        this.playerCtn.y = (this.stageHeight - 690) * .5;
    };
    WinPanelView.prototype.show = function () {
        this.ctn.show();
    };
    WinPanelView.prototype.hide = function () {
        this.ctn.hide();
    };
    WinPanelView.prototype.fadeIn = function () {
        for (var i = 0; i < 4; i++) {
            var playerCard = this.playerCtn.getChildAt(i);
            createjs.Tween.get(playerCard)
                .to({ scaleX: 1, scaleY: 1 }, 300, createjs.Ease.bounceInOut);
        }
    };
    WinPanelView.prototype.fadeOut = function () {
        for (var i = 0; i < 4; i++) {
            var playerCard = this.playerCtn.getChildAt(i);
            createjs.Tween.get(playerCard)
                .to({ x: 500, scaleX: 0.01, scaleY: 0.01 }, 100, createjs.Ease.bounceInOut);
        }
    };
    WinPanelView.prototype.initOp = function () {
        var _this = this;
        _super.prototype.initOp.call(this);
        $("#btnFadeOut").click(function (e) {
            _this.fadeOut();
        });
        $("#btnFadeIn").click(function (e) {
            _this.fadeIn();
        });
        $("#btnUpdateAll").click(function (e) {
            var playerIdArr = [];
            for (var i = 0; i < 4; i++) {
                var pos = i;
                var playerId = $($(".playerId")[pos]).val();
                if (playerId) {
                    playerIdArr.push({ playerId: playerId, pos: pos });
                }
            }
            if (playerIdArr.length)
                cmd.proxy(CommandId.cs_updatePlayerAllWin, { playerIdArr: playerIdArr, mvp: _this.mvpPos, isRed: _this.isRed });
        });
        var mvpArr = $(".playerMvp");
        mvpArr[0].checked = true;
        mvpArr.change(function (e) {
            _this.mvpPos = parseInt($(e.target).data("pos").toString());
        });
        var isRedArr = $(".isRed");
        isRedArr[0].checked = true;
        isRedArr.change(function (e) {
            _this.isRed = ($(e.target).data("pos").toString() == "1");
        });
    };
    WinPanelView.prototype.onServerBroadcast = function () {
        var _this = this;
        cmd.on(CommandId.updatePlayerAllWin, function (playerInfoArr) {
            _this.setPlayerInfoArr(playerInfoArr, true);
        });
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
    Client.prototype.newWsClient = function (pid, host, port) {
        var wsc = new WebSocket('ws://' + host + ':' + port);
        return wsc;
    };
    Client.prototype.initWsClient = function (pid, host, port) {
        var _this = this;
        var wsc = new WebSocket('ws://' + host + ':' + port);
        var isAlive = false;
        var relinkTimer;
        var initReq = function () {
            wsc.send(msgpack.encode({ req: "info", pid: pid }));
        };
        var relink = function () {
            console.log('ws relink');
            wsc = _this.initWsClient(pid, host, port);
            if (isAlive)
                clearInterval(relinkTimer);
        };
        wsc.onopen = function () {
            isAlive = true;
            initReq();
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
        wsc.onclose = function (event) {
            isAlive = false;
            console.log(event);
            relinkTimer = setInterval(relink, 1);
        };
        wsc.onerror = function (event) {
            console.log(event);
        };
        cmd.proxy = function (type, param) {
            wsc.send(msgpack.encode({ req: "op", pid: pid, param: { type: type, param: param } }));
        };
        return wsc;
        // appInfo.wsc = wsc;
    };
    Client.prototype.initPanel = function (pid, param) {
        var stage = this.initCanvas();
        var viewMap = {};
        viewMap[PanelId.stagePanel] = StagePanelView;
        viewMap[PanelId.playerPanel] = PlayerPanelView;
        viewMap[PanelId.winPanel] = WinPanelView;
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
