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
function queueFile(pathArr, callback) {
    var len = pathArr.length;
    var count = 0;
    var loadOne = function (err, jobj) {
        if (err)
            callback(err, null);
        else {
            pathArr[count].data = jobj;
            count++;
            if (count == len)
                callback(null, pathArr);
            else
                readFile(pathArr[count].src, null, loadOne);
        }
    };
    readFile(pathArr[0].src, null, loadOne);
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
    function AppInfo() {
        _super.call(this);
        this.panel = new PanelInfo();
    }
    return AppInfo;
}(EventDispatcher));
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
    CommandId[CommandId["updatePlayer"] = 100020] = "updatePlayer";
    CommandId[CommandId["cs_updatePlayer"] = 100021] = "cs_updatePlayer";
    CommandId[CommandId["updatePlayerAll"] = 100022] = "updatePlayerAll";
    CommandId[CommandId["cs_updatePlayerAll"] = 100023] = "cs_updatePlayerAll";
    //
    CommandId[CommandId["updateLeftTeam"] = 100024] = "updateLeftTeam";
    CommandId[CommandId["updateRightTeam"] = 100025] = "updateRightTeam";
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
                var avatarBmp = new createjs.Bitmap("/img/player/p0.png");
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
        // var op = gui.Window.open ('http://localhost/panel/stage/op', {
        //    position: 'center',
        //    toolbar: false,
        //    width: 1920,
        //    height: 1200
        // });
        this.isMaximize = false;
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
        var _this = this;
        if (serverConf.host == 'localhost')
            serverConf.host = this.getIPAddress();
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
            var data = { pid: pid, op: op, host: serverConf.host, port: serverConf.port };
            var s1 = JSON.stringify(data);
            var s2 = s1.substr(0, s1.length - 1) + ',"' + pid + '":1}';
            data = JSON.parse(s2);
            res.render('panel', data);
        });
        app.post('/getPlayerInfo/:playerId', function (req, res) {
            var playerId = req.params.playerId;
            // var pos = req.params.pos;
            console.log("PlayerInfo ", playerId);
            // var playerInfo = new PlayerInfo();
            jsonfile.readFile("data/" + playerId + '.player', null, function (err, confData) {
                if (err) {
                    console.log(err, "no player");
                    res.send(JSON.stringify({ playerInfo: "" }));
                }
                else {
                    console.log("find player");
                    res.send(JSON.stringify({ playerInfo: confData }));
                }
            });
        });
        //setup the web server
        app.server = http.createServer(app);
        //listen up
        app.server.listen(80, function () {
            //and... we're live
            console.log("host:", _this.getIPAddress(), "ws port:", serverConf.port);
        });
        this.serverSend();
        this.handleOp();
    }
    HttpServer.prototype.getIPAddress = function () {
        var interfaces = require('os').networkInterfaces();
        for (var devName in interfaces) {
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    };
    HttpServer.prototype.handleOp = function () {
        cmd.on(CommandId.cs_updatePlayerAll, function (param) {
            // var queue = new createjs.LoadQueue();
            // queue.on("complete", handleComplete, this);
            // var manifest = [];
            // //[{playerId:1,pos:1}]
            for (var i = 0; i < param.length; i++) {
                var obj = param[i];
                obj.src = 'data/' + obj.playerId + '.player';
            }
            queueFile(param, handleComplete);
            // queue.loadManifest(manifest);
            function handleComplete(err, param) {
                if (err) {
                }
                else {
                    console.log(this, "load all playerInfo");
                    for (var i = 0; i < param.length; i++) {
                        var obj = param[i];
                        obj.playerInfo = obj.data;
                        delete obj['data'];
                        console.log(this, "load playerInfo id:", obj.playerId, obj.playerInfo);
                    }
                    appInfo.panel.stage.updatePlayerAll(param);
                }
            }
        });
        cmd.on(CommandId.cs_updatePlayer, function (param) {
            appInfo.panel.stage.updatePlayer(param);
        });
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
        cmd.on(CommandId.cs_moveStagePanel, function (param) {
            appInfo.panel.stage.movePanel(param);
        });
    };
    HttpServer.prototype.serverSend = function () {
        var url = require('url');
        var WebSocketServer = require('ws').Server, wss = new WebSocketServer({ port: serverConf.port });
        wss.on('connection', function connection(wsClient) {
            // var location = url.parse(wsClient.upgradeReq.url, true);
            // you might use location.query.access_token to authenticate or share sessions
            // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
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
var server;
jsonfile.readFile("config.json", null, function (err, confData) {
    if (confData.server['host'])
        serverConf.host = confData.server['host'];
    if (confData.server['wsPort'])
        serverConf.port = confData.server['wsPort'];
    server = new HttpServer();
});
var app;
appInfo.isServer = true;
appInfo.savePlayerInfo = function (playerInfo) {
    if (playerInfo.id())
        jsonfile.writeFile("data/" + playerInfo.id() + '.player', playerInfo.playerData, null, function (err, confData) {
        });
    else
        throw Error("no player id!!!");
};
appInfo.parsePlayerInfo = function () {
};
$(function () {
    app = new YuanqiTvView(appInfo);
    app.run();
    var playerInfo = new PlayerInfo();
    playerInfo.id(111);
    playerInfo.name("tmac");
    playerInfo.avatar("/img/player/p1.png");
    playerInfo.eloScore(2431);
    playerInfo.style(2);
    playerInfo.winpercent(.9501);
    appInfo.savePlayerInfo(playerInfo);
    //new Test(cmd,appInfo);
});
//# sourceMappingURL=main.js.map