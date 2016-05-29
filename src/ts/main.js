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
function base64ToPng(imgPath2, base64Data, callback) {
    var base64Data = base64Data.replace(/^data:image\/png;base64,/, "");
    var writePath = imgPath2;
    if (!isDev)
        writePath = M_path.join(appExecPath, imgPath2);
    writeFile(writePath, base64Data, 'base64', function (err) {
        if (!err) {
            if (callback)
                callback('/' + imgPath2);
        }
    });
}
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
 * Created by toramisu on 2016/5/9.
 */
/// <reference path="../event/ActEvent.ts"/>
var AppInfo = (function (_super) {
    __extends(AppInfo, _super);
    // wsc:any;
    function AppInfo() {
        _super.call(this);
        // this.panel = new PanelInfo();
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
    CommandId[CommandId["notice"] = 100028] = "notice";
    CommandId[CommandId["cs_notice"] = 100029] = "cs_notice";
    //-----------------win panel
    CommandId[CommandId["fadeInWinPanel"] = 100030] = "fadeInWinPanel";
    CommandId[CommandId["cs_fadeInWinPanel"] = 100031] = "cs_fadeInWinPanel";
    CommandId[CommandId["fadeOutWinPanel"] = 100032] = "fadeOutWinPanel";
    CommandId[CommandId["cs_fadeOutWinPanel"] = 100033] = "cs_fadeOutWinPanel";
    CommandId[CommandId["saveGameRec"] = 100034] = "saveGameRec";
    CommandId[CommandId["cs_saveGameRec"] = 100035] = "cs_saveGameRec";
    //---------------- player panel
    CommandId[CommandId["fadeInPlayerPanel"] = 100036] = "fadeInPlayerPanel";
    CommandId[CommandId["cs_fadeInPlayerPanel"] = 100037] = "cs_fadeInPlayerPanel";
    CommandId[CommandId["fadeOutPlayerPanel"] = 100038] = "fadeOutPlayerPanel";
    CommandId[CommandId["cs_fadeOutPlayerPanel"] = 100039] = "cs_fadeOutPlayerPanel";
    CommandId[CommandId["movePlayerPanel"] = 100040] = "movePlayerPanel";
    CommandId[CommandId["cs_movePlayerPanel"] = 100041] = "cs_movePlayerPanel";
    //自动三杀事件
    CommandId[CommandId["straightScore3"] = 100042] = "straightScore3";
    CommandId[CommandId["straightScore5"] = 100043] = "straightScore5";
    CommandId[CommandId["initPanel"] = 100044] = "initPanel";
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
var fs = require('fs');
var Stream = require('stream');
var zlib = require('zlib');
var process = require('process');
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
var ElmId$ = {
    buttonAddLeftScore: "#btnAddLeftScore",
    buttonAddRightScore: "#btnAddRightScore"
};
var PanelId = {
    stagePanel: 'stage',
    winPanel: 'win',
    actPanel: 'act',
    playerPanel: 'player'
};
/// <reference path="JQuery.ts"/>
/// <reference path="libs/createjs/easeljs.d.ts"/>
/// <reference path="libs/createjs/createjs.d.ts"/>
/// <reference path="libs/createjs/createjs-lib.d.ts"/>
/// <reference path="libs/createjs/tweenjs.d.ts"/>
/// <reference path="../Model/Command.ts"/>
/// <reference path="../Model/ElemID.ts"/>
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
/// <reference path="../../model/BaseInfo.ts"/>
var PlayerData = (function () {
    function PlayerData() {
        this.id = 0;
        this.name = '';
        this.phone = 0;
        this.eloScore = 0;
        this.style = 0; //风林火山 1 2 3 4
        this.avatar = "";
        this.height = 0;
        this.weight = 0;
        this.dtScore = 0; //最近一场天梯分变化
        this.winpercent = 0; //  胜率  100/100.0%
        this.activityId = 0; //赛事id
        this.gameRec = []; //比赛记录
        this.gameCount = 0; //场数
        this.loseGameCount = 0;
        this.winGameCount = 0;
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
            if (playerData['isRed'] != null)
                this.isRed = playerData.isRed;
            if (playerData['isMvp'] != null)
                this.isMvp = playerData.isMvp;
            if (playerData['backNumber'] != null)
                this.backNumber = playerData.backNumber;
        }
    }
    PlayerInfo.prototype.getPlayerData = function () {
        this.playerData['isRed'] = this.isRed;
        this.playerData['isMvp'] = this.isMvp;
        this.playerData['backNumber'] = this.backNumber;
        return this.playerData;
    };
    PlayerInfo.prototype.id = function (val) {
        return prop(this.playerData, "id", val);
    };
    PlayerInfo.prototype.phone = function (val) {
        return prop(this.playerData, "phone", val);
    };
    PlayerInfo.prototype.name = function (val) {
        return prop(this.playerData, "name", val);
    };
    PlayerInfo.prototype.activityId = function (val) {
        return prop(this.playerData, "activityId", val);
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
    PlayerInfo.prototype.gameRec = function (val) {
        return prop(this.playerData, "gameRec", val);
    };
    PlayerInfo.prototype.winpercent = function (val) {
        return prop(this.playerData, "winpercent", val);
    };
    PlayerInfo.prototype.gameCount = function (val) {
        return prop(this.playerData, "gameCount", val);
    };
    PlayerInfo.prototype.winGameCount = function (val) {
        return prop(this.playerData, "winGameCount", val);
    };
    PlayerInfo.prototype.loseGameCount = function (val) {
        return prop(this.playerData, "loseGameCount", val);
    };
    PlayerInfo.prototype.getWinPercent = function () {
        return (this.winpercent() * 100).toFixed(1) + "%";
    };
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
    PlayerInfo.prototype.saveScore = function (dtScore, isWin) {
        this.dtScore(dtScore);
        this.eloScore(this.eloScore() + dtScore);
        // this.ret.push({score: this.eloScore, isWin: isWin});
        if (isWin) {
            this.winGameCount(this.winGameCount() + 1);
        }
        else
            this.loseGameCount(this.loseGameCount() + 1);
        this.gameCount(this.gameCount() + 1);
    };
    PlayerInfo.prototype.getCurWinningPercent = function () {
        return this.winGameCount() / (this.loseGameCount() + this.winGameCount());
    };
    return PlayerInfo;
}(BaseInfo));
/// <reference path="../models/PlayerInfo.ts"/>
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
            avatar.x = (180 - 180 * 1.2) * .5 + 60;
            avatar.y = 45 + 30;
        }
        else {
            avatar.scaleX = avatar.scaleY = 1.2;
            avatar.x = (180 - 180 * 1.2) * .5 + 60;
            avatar.y = 50 + 30;
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
            bg.x = -192 + 60;
            bg.y = -135 + 30;
        }
        else {
            bg.x = -176 + 60;
            bg.y = -110 + 30;
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
        name.x = 90 + 60;
        if (isMvp)
            name.x += 20;
        name.y = 185 + 30;
        ctn.addChild(name);
        this.nameLabel = name;
        var eloScore;
        eloScore = new createjs.Text(p.eloScore(), "bold 32px Arial", nameCol);
        eloScore.textAlign = 'center';
        eloScore.x = name.x;
        eloScore.y = 245 + 30;
        if (isMvp)
            eloScore.y += 30;
        ctn.addChild(eloScore);
        var eloScoreDt = new createjs.Text("+" + p.eloScore(), "12px Arial", col);
        eloScoreDt.textAlign = 'left';
        eloScoreDt.x = 140 + 60;
        eloScoreDt.y = 260 + 30;
        if (isMvp) {
            eloScoreDt.x += 30;
            eloScoreDt.y += 30;
        }
        ctn.addChild(eloScoreDt);
        var winpercent = new createjs.Text("胜率" + p.winpercent().toFixed(3) * 100 + "%", "18px Arial", col);
        winpercent.textAlign = 'center';
        winpercent.x = name.x;
        winpercent.y = 290 + 30;
        if (isMvp)
            winpercent.y += 35;
        ctn.addChild(winpercent);
        var gameCount = new createjs.Text("总场数" + p.gameCount(), "18px Arial", col);
        gameCount.textAlign = 'center';
        gameCount.x = name.x;
        gameCount.y = 320 + 30;
        if (isMvp)
            gameCount.y += 35;
        ctn.addChild(gameCount);
        var style = new createjs.Bitmap(p.getWinStyleIcon());
        style.x = 50 + 60;
        style.y = 340 + 30;
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
    PlayerView.getLeftStagePlayerCard = function (playerInfo) {
        //width 150
        var ctn = new createjs.Container();
        var leftAvatarBg = new createjs.Bitmap("/img/panel/leftAvatarBg.png"); //694x132
        leftAvatarBg.x = 15;
        leftAvatarBg.y = 6;
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
        var img = new Image();
        img.onload = function () {
            avatarBmp.scaleX = avatarBmp.scaleY = 180 / this.width;
        };
        img.src = playerInfo.avatar();
        var avatarBmp = new createjs.Bitmap(playerInfo.avatar());
        avatarBmp.mask = leftMask;
        avatarCtn.addChild(leftMask);
        avatarCtn.addChild(avatarBmp);
        // leftAvatarBmp = avatarBmp;
        //        this.avatarArr.push(avatarCtn);
        ctn.addChild(avatarCtn);
        ctn.addChild(leftAvatarBg);
        var leftEloBg = new createjs.Bitmap("/img/panel/leftEloBg.png"); //694x132
        leftEloBg.x = leftAvatarBg.x + 27;
        leftEloBg.y = 70;
        ctn.addChild(leftEloBg);
        var leftEloLabel = new createjs.Text("1984", "18px Arial", "#e2e2e2");
        leftEloLabel.textAlign = "left";
        leftEloLabel.x = leftEloBg.x + 12;
        leftEloLabel.y = leftEloBg.y + 3;
        //        this.eloLabelArr.push(leftEloLabel);
        ctn.addChild(leftEloLabel);
        var styleCtn = new createjs.Container();
        var leftStyleIcon = new createjs.Bitmap("/img/panel/feng.png"); //694x132
        styleCtn.x = leftAvatarBg.x + 120;
        styleCtn.y = leftAvatarBg.y + 80;
        styleCtn.addChild(leftStyleIcon);
        //        this.styleArr.push(styleCtn);
        ctn.addChild(styleCtn);
        var leftNameLabel = new createjs.Text("player", "bold 18px Arial", "#e2e2e2");
        leftNameLabel.textAlign = "left";
        leftNameLabel.x = leftAvatarBg.x + 20;
        leftNameLabel.y = leftAvatarBg.y + 90;
        //        this.nameLabelArr.push(leftNameLabel);
        ctn.addChild(leftNameLabel);
        return ctn;
    };
    return PlayerView;
}());
var NoticePanelView = (function () {
    function NoticePanelView(parent) {
        this.isInit = false;
        this.parent = parent;
    }
    NoticePanelView.prototype.init = function () {
        this.ctn = new createjs.Container();
        var bg = new createjs.Bitmap('/img/panel/noticeBg.png');
        this.ctn.addChild(bg);
        // this.noticeLabel = new createjs.Text("手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦", "28px Arial", "#e2e2e2");
        // this.ctn.addChild(this.noticeLabel);
        this.contentCtn = new createjs.Container();
        this.contentCtn.x = 72;
        this.contentCtn.y = 26;
        this.ctn.addChild(this.contentCtn);
        this.mask = new createjs.Shape();
        this.mask.graphics.beginFill("#eee")
            .drawRect(0, 0, 930, 50);
        // this.ctn.addChild(mask);
        // this.contentCtn.addChild(mask);
        // this.noticeLabel.mask = mask;
        this.parent.addChild(this.ctn);
        this.isInit = true;
    };
    NoticePanelView.prototype.getCtn = function () {
        if (!this.isInit)
            this.init();
        return this.ctn;
    };
    NoticePanelView.prototype.fadeInNotice = function (imgData) {
        if (!this.isInit)
            this.init();
        if (this.noticeImg)
            this.contentCtn.removeChild(this.noticeImg);
        this.noticeImg = new createjs.Bitmap(imgData);
        this.noticeImg.mask = this.mask;
        this.contentCtn.addChild(this.noticeImg);
    };
    return NoticePanelView;
}());
/// <reference path="../../view/BaseView.ts"/>
/// <reference path="PlayerView.ts"/>
/// <reference path="NoticePanelView.ts"/>
var StagePanelView = (function (_super) {
    __extends(StagePanelView, _super);
    function StagePanelView() {
        _super.apply(this, arguments);
    }
    StagePanelView.prototype.init = function (param) {
        _super.prototype.init.call(this, param);
        var ctn = new createjs.Container();
        this.ctn = ctn;
        this.stage.addChild(ctn);
        cmd.emit(CommandId.initPanel, param);
    };
    return StagePanelView;
}(BaseView));
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
        // document.onmousemove = (e)=> {
        //     this.appInfo.mouseX = e.clientX;
        //     this.appInfo.mouseY = e.clientY;
        //     this.appInfo.emit(MouseEvt.MOVE);
        // };
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
    port: 8086,
    staticPath: "."
};
/// <reference path="../../utils/JSONFile.ts"/>
var PlayerAdmin = (function () {
    function PlayerAdmin() {
    }
    // static base64ToPng(imgPath, base64Data, callback) {
    //     var base64Data = base64Data.replace(/^data:image\/png;base64,/, "");
    //     var writePath = imgPath;
    //     if (!isDev)
    //         writePath = M_path.join(appExecPath, imgPath);
    //     writeFile(writePath, base64Data, 'base64', (err)=> {
    //         if (!err) {
    //             callback('/' + imgPath);
    //         }
    //     });
    // }
    PlayerAdmin.index = function (req, res) {
        dbPlayerInfo().find({}, function (err, docs) {
            var data = { adminId: 'playerList' };
            if (!err)
                data.playerDataArr = docs;
            res.render('playerAdminIndex', data);
            console.log("/admin/player/ length:", docs.length, JSON.stringify(data.playerDataArr));
        });
    };
    PlayerAdmin.showPlayerById = function (req, res) {
        var playerId = req.params.id;
        var data = { adminId: 'player', op: '', playerData: {} };
        if (playerId == "new") {
            data.op = 'new';
            res.render('baseAdmin', data);
        }
        else {
            playerId = parseInt(playerId);
            data.op = 'update';
            dbPlayerInfo().find({ id: playerId }, function (err, doc) {
                if (!err) {
                    data.playerData = doc[0];
                    res.render('baseAdmin', data);
                }
                else
                    res.send(err);
            });
        }
    };
    PlayerAdmin.deletePlayerData = function (req, res) {
        if (!req.body)
            return res.sendStatus(400);
        var playerId = parseInt(req.body.id);
        dbPlayerInfo().remove({ id: playerId }, {}, function (err, numRemoved) {
            // numRemoved = 1
            if (!err) {
                res.send("sus");
            }
            else {
                res.send(err);
            }
        });
    };
    PlayerAdmin.makeRightType = function (data) {
        var newData = {};
        newData.id = parseInt(data.id);
        newData.phone = parseInt(data.phone);
        newData.weight = parseInt(data.weight);
        newData.height = parseInt(data.height);
        newData.eloScore = parseInt(data.eloScore);
        newData.style = parseInt(data.style);
        newData.name = data.name;
        newData.activityId = parseInt(data.activityId);
        return newData;
    };
    PlayerAdmin.updatePlayerData = function (req, res) {
        if (!req.body)
            return res.sendStatus(400);
        console.log('updatePlayer req:', JSON.stringify(req.body));
        var playerId = parseInt(req.body.id);
        var updateData = PlayerAdmin.makeRightType(req.body);
        // updateData.phone = parseInt(req.body.phone);
        // updateData.weight = parseInt(req.body.weight);
        // updateData.height = parseInt(req.body.height);
        // updateData.eloScore = parseInt(req.body.eloScore);
        // updateData.style = parseInt(req.body.style);
        // updateData.name = req.body.name;
        // updateData.activityId = parseInt(req.body.activityId);
        function updateToDb(data) {
            console.log('updatePlayer data:', JSON.stringify(data));
            dbPlayerInfo().update({ id: playerId }, { $set: data }, {}, function (err, doc) {
                if (!err) {
                    console.log('db data:', JSON.stringify(doc));
                    res.send("sus");
                }
                else {
                    console.log('updateToDb err', JSON.stringify(err));
                    res.send(err);
                }
            });
        }
        if (req.body.avatar) {
            var imgPath = "img/player/" + playerId + '.png';
            base64ToPng(imgPath, req.body.avatar, function (imgPath) {
                updateData.avatar = imgPath;
                updateToDb(updateData);
            });
        }
        else {
            updateToDb(updateData);
        }
    };
    PlayerAdmin.newPlayer = function (req, res) {
        if (!req.body)
            return res.sendStatus(400);
        var playerInfo = new PlayerInfo(req.body);
        playerInfo.id(dbPlayerInfo().getNewId());
        var imgPath1 = "img/player/" + playerInfo.id() + '.png';
        base64ToPng(imgPath1, req.body.avatar, function (imgPath) {
            playerInfo.avatar(imgPath);
            var data = PlayerAdmin.makeRightType(playerInfo.playerData);
            data.avatar = imgPath;
            dbPlayerInfo().insert(data, function (err, newDoc) {
                if (!err) {
                    dbPlayerInfo().saveIdUsed();
                    res.redirect("/admin/player/");
                }
                else
                    req.send(err);
            });
        });
        console.log('/admin/player/new', req.body.name);
    };
    return PlayerAdmin;
}());
var ActivityAdmin = (function () {
    function ActivityAdmin() {
    }
    ActivityAdmin.getActivityDateArr = function (req, res) {
        if (!req.body)
            return res.sendStatus(400);
        console.log('getActivityDateArr', JSON.stringify(req.body));
        db.activity.getDateArrByActivityId(req.body.activityId, function (docs) {
            res.send(docs);
        });
    };
    ;
    ActivityAdmin.index = function (req, res) {
        var actId = req.params.id;
        var data = { activityId: actId };
        res.render('activity/activityAdmin', data);
    };
    ActivityAdmin.genPrintPng = function (req, res) {
        base64ToPng('img/cache/game.png', req.body.base64, function () {
            res.send('/img/cache/game.png');
        });
    };
    ActivityAdmin.genActivity = function (req, res) {
        if (!req.body)
            return res.sendStatus(400);
        console.log('gen activity ', JSON.stringify(req.body.activityData));
        db.activity.addActivity(req.body.activityData);
    };
    ActivityAdmin.getActivityPlayerArr = function (req, res) {
        if (!req.body)
            return res.sendStatus(400);
        var actId = parseInt(req.body.id);
        dbPlayerInfo().getActivityPlayerDataArr(actId, function (err, docs) {
            if (!err) {
                res.send(docs);
            }
            else {
                res.send(err);
            }
        });
    };
    return ActivityAdmin;
}());
/// <reference path="../../Node.ts"/>
/////
var appExecPath = M_path.dirname(process.execPath);
var isDev;
//path for external
function pathEx(p) {
    return isDev ? p : M_path.join(appExecPath, p);
}
/////////////////
var db;
function dbPlayerInfo() {
    return db.player;
}
function dbActivityInfo() {
    return db.activity;
}
// var Document = require('camo').Document;
var Datastore = require('nedb');
var BaseDB = (function () {
    function BaseDB(option) {
        var _this = this;
        this.dbPath = option.filename;
        this.dataStore = new Datastore(option);
        this.dataStore.find({ id: 0 }, function (err, docs) {
            console.log('find config', _this.dbPath);
            if (!err) {
                if (docs.length)
                    _this.config = docs[0];
                else
                    _this.init();
            }
        });
    }
    BaseDB.prototype.init = function () {
        var _this = this;
        this.dataStore.insert({ id: 0, idUsed: 1 }, function (err, newDoc) {
            console.log('onload inti db config');
            console.log(_this, JSON.stringify(newDoc));
            _this.config = newDoc;
        });
    };
    BaseDB.prototype.saveIdUsed = function () {
        this.config.idUsed++;
        this.dataStore.update({ id: 0 }, { $set: this.config });
    };
    ;
    BaseDB.prototype.getActivityPlayerDataArr = function () {
    };
    return BaseDB;
}());
var ActivityDB = (function (_super) {
    __extends(ActivityDB, _super);
    function ActivityDB() {
        _super.apply(this, arguments);
    }
    ActivityDB.prototype.addActivity = function (data) {
        var _this = this;
        data.date = this.config.idUsed;
        this.dataStore.insert(data, function (err, newDoc) {
            if (!err) {
                _this.saveIdUsed();
            }
        });
    };
    ActivityDB.prototype.getDateArrByActivityId = function (actId, callback) {
        this.dataStore.find({ activityId: actId }, function (err, docs) {
            callback(docs);
        });
    };
    return ActivityDB;
}(BaseDB));
var GameDB = (function (_super) {
    __extends(GameDB, _super);
    function GameDB() {
        _super.apply(this, arguments);
    }
    return GameDB;
}(BaseDB));
function initDB() {
    // Fetch a collection to insert document into
    var playerDb = pathEx('db/player.db');
    var activityDb = pathEx('db/activity.db');
    var gameDbPath = pathEx('db/game.db');
    db = {};
    db.player = new Datastore({ filename: playerDb, autoload: true });
    db.activity = new ActivityDB({ filename: activityDb, autoload: true });
    db.game = new GameDB({ filename: gameDbPath, autoload: true });
    db.player.find({ id: 0 }, function (err, doc) {
        db.player.config = doc[0];
    });
    db.player.saveIdUsed = function () {
        db.player.config.playerIdUsed++;
        db.player.update({ id: 0 }, { $set: db.player.config });
    };
    db.player.getNewId = function () {
        return db.player.config.playerIdUsed;
    };
    db.player.getActivityPlayerDataArr = function (actId, callback) {
        db.player.find({ $not: { id: 0 }, activityId: actId }).sort({ eloScore: 1 }).exec(function (err, docs) {
            callback(err, docs);
        });
    };
    console.log(process.cwd());
    // Get path of project binary:
    console.log(M_path.dirname(process.execPath));
}
var EloConf = {
    score: 2000,
    K: 32
};
/// <reference path="./PlayerInfo.ts"/>
/// <reference path="./EloInfo.ts"/>
var TeamInfo = (function () {
    function TeamInfo() {
        this.playerInfoArr = [];
    }
    TeamInfo.prototype.setPlayer = function (player, pos) {
        // if (pos) {
        //     this.playerArr.splice(player,0,pos)
        // }
        // else {
        //     this.playerArr.push(player);
        // }
    };
    TeamInfo.prototype.length = function () {
        return this.playerInfoArr.length;
    };
    TeamInfo.prototype.push = function (playerInfo) {
        this.playerInfoArr.push(playerInfo);
    };
    TeamInfo.prototype.setScore = function (score) {
        this.score = score;
    };
    TeamInfo.prototype.setName = function (name) {
        this.name = name;
    };
    TeamInfo.prototype.clear = function () {
        this.score = 0;
    };
    TeamInfo.prototype.setPlayerArr = function (playerArr) {
        this.playerInfoArr.length = 0;
        this.playerInfoArr = this.playerInfoArr.concat(playerArr);
        this.score = 0;
        for (var i = 0; i < this.playerInfoArr.length; i++) {
            var player = this.playerInfoArr[i];
            this.score += player.eloScore();
        }
        this.score /= this.playerInfoArr.length;
        console.log(this, "player score:", this.score);
    };
    TeamInfo.prototype.beat = function (loserTeam) {
        var Elo1 = this.score;
        var Elo2 = loserTeam.score;
        var K = EloConf.K;
        var EloDifference = Elo2 - Elo1;
        var percentage = 1 / (1 + Math.pow(10, EloDifference / 400));
        var win = Math.round(K * (1 - percentage));
        //this.score += win;
        this.saveScore(win, true);
        loserTeam.saveScore(-win, false);
        //loserTeam.score -= win;
        // this.getWinningPercent() = Math.round(percentage * 100);
    };
    //交换两队中的随机两人
    TeamInfo.prototype.mix2 = function (teamInfo) {
        var tmp;
        tmp = this.playerInfoArr[1];
        this.playerInfoArr[1] = teamInfo.playerInfoArr[3];
        teamInfo.playerInfoArr[3] = tmp;
        tmp = this.playerInfoArr[3];
        this.playerInfoArr[3] = teamInfo.playerInfoArr[2];
        teamInfo.playerInfoArr[2] = tmp;
    };
    TeamInfo.prototype.getPercentage = function () {
        //var Elo1 = this.score;
        //
        //var Elo2 = loserTeam.score;
        //
        //var K = EloConf.K;
        //
        //var EloDifference = Elo2 - Elo1;
        //
        //var percentage = 1 / ( 1 + Math.pow(10, EloDifference / 400) );
    };
    TeamInfo.prototype.saveScore = function (score, isWin) {
        this.score += score;
        for (var i = 0; i < this.playerInfoArr.length; i++) {
            var player = this.playerInfoArr[i];
            player.saveScore(score, isWin);
        }
    };
    TeamInfo.prototype.getNewPlayerDataArr = function () {
        var a = [];
        for (var i = 0; i < this.playerInfoArr.length; i++) {
            var playerInfo = this.playerInfoArr[i];
            a.push(playerInfo.getPlayerData());
        }
        return a;
    };
    TeamInfo.prototype.getWinningPercent = function () {
        var wp;
        for (var i = 0; i < this.playerInfoArr.length; i++) {
            var player = this.playerInfoArr[i];
            wp += player.getCurWinningPercent();
        }
        wp /= this.playerInfoArr.length;
        return wp;
    };
    return TeamInfo;
}());
var GameInfo = (function () {
    function GameInfo() {
        this.gameId = 0;
        this.winScore = 7;
        this.leftScore = 0;
        this.rightScore = 0;
        this.time = 0;
        this.timerState = 0;
        this.straightScoreLeft = 0; //连杀判定
        this.straightScoreRight = 0; //连杀判定
        this.playerInfoArr = new Array(8);
        this._timer = 0;
        this._isUnsaved = false; //未保存状态
    }
    GameInfo.prototype.toggleTimer = function () {
        var _this = this;
        if (this._timer) {
            this.resetTimer();
            this.timerState = 0;
        }
        else {
            this._timer = setInterval(function () {
                _this.time++;
            }, 1000);
            this.timerState = 1;
        }
    };
    GameInfo.prototype.saveGameRec = function () {
        if (this._isUnsaved) {
            this._isUnsaved = false;
            function saveTeamPlayerData(teamInfo) {
                for (var _i = 0, _a = teamInfo.playerInfoArr; _i < _a.length; _i++) {
                    var playerInfo = _a[_i];
                    console.log("playerData", JSON.stringify(playerInfo));
                    if (!playerInfo.gameRec())
                        playerInfo.gameRec([]);
                    playerInfo.gameRec().push(this.gameId);
                    console.log(playerInfo.name(), " cur player score:", playerInfo.eloScore(), playerInfo.dtScore());
                    this.playerDb.update({ id: playerInfo.id() }, { $set: playerInfo.playerData }, {}, function (err, doc) {
                        console.log("saveGameRec: game rec saved");
                    });
                }
            }
            saveTeamPlayerData(this._winTeam);
            saveTeamPlayerData(this._loseTeam);
        }
    };
    GameInfo.prototype.resetTimer = function () {
        clearInterval(this._timer);
        this._timer = 0;
    };
    GameInfo.prototype.setPlayerInfoByPos = function (pos, playerInfo) {
        playerInfo.isRed = (pos > 3);
        this.playerInfoArr[pos] = playerInfo;
    };
    GameInfo.prototype._setGameResult = function (isLeftWin) {
        if (!this._isUnsaved) {
            console.log("setGameResult: game rec unsaved");
            var teamLeft = new TeamInfo();
            teamLeft.setPlayerArr(this.getLeftTeam());
            var teamRight = new TeamInfo();
            teamRight.setPlayerArr(this.getRightTeam());
            if (isLeftWin) {
                teamLeft.beat(teamRight);
                this._winTeam = teamLeft;
                this._loseTeam = teamRight;
            }
            else {
                teamRight.beat(teamLeft);
                this._winTeam = teamRight;
                this._loseTeam = teamLeft;
            }
            this.playerInfoArr = teamLeft.getNewPlayerDataArr().concat(teamRight.getNewPlayerDataArr());
            console.log("playerData", JSON.stringify(this.playerInfoArr));
            this._isUnsaved = true;
            return this._winTeam;
        }
    };
    GameInfo.prototype.setLeftTeamWin = function () {
        return this._setGameResult(true);
    };
    GameInfo.prototype.setRightTeamWin = function () {
        return this._setGameResult(false);
    };
    GameInfo.prototype.getPlayerInfoArr = function () {
        return this.playerInfoArr;
    };
    GameInfo.prototype.getLeftTeam = function (start) {
        if (start === void 0) { start = 0; }
        var team = [];
        for (var i = start; i < 4 + start; i++) {
            var pInfo = new PlayerInfo(this.playerInfoArr[i]);
            team.push(pInfo);
            pInfo.isRed = (start > 0);
        }
        return team;
    };
    GameInfo.prototype.getRightTeam = function () {
        return this.getLeftTeam(4);
    };
    return GameInfo;
}());
/// <reference path="../../event/ActEvent.ts"/>
/// <reference path="./PlayerInfo.ts"/>
/// <reference path="./TeamInfo.ts"/>
/// <reference path="./GameInfo.ts"/>
/// <reference path="./DbInfo.ts"/>
/// <reference path="../../utils/JSONFile.ts"/>
var PanelInfo = (function () {
    function PanelInfo() {
        this.stage = new StagePanelInfo(PanelId.stagePanel);
        this.player = new PlayerPanelInfo(PanelId.playerPanel);
        this.player.stageInfo = this.stage;
        this.act = new ActivityPanelInfo(PanelId.actPanel);
    }
    return PanelInfo;
}());
var BasePanelInfo = (function (_super) {
    __extends(BasePanelInfo, _super);
    function BasePanelInfo(pid) {
        _super.call(this);
        this.pid = pid;
        this.initInfo();
    }
    BasePanelInfo.prototype.initInfo = function () {
    };
    return BasePanelInfo;
}(EventDispatcher));
var PlayerPanelInfo = (function (_super) {
    __extends(PlayerPanelInfo, _super);
    function PlayerPanelInfo() {
        _super.apply(this, arguments);
        this.position = { ctnX: 500, ctnY: 500 };
    }
    PlayerPanelInfo.prototype.getInfo = function () {
        return {
            playerInfoArr: this.stageInfo.getPlayerInfoArr(),
            playerInfo: this.playerData,
            position: this.position
        };
    };
    PlayerPanelInfo.prototype.showPlayerPanel = function (param) {
        var playerId = parseInt(param);
        for (var i = 0; i < this.stageInfo.getPlayerInfoArr().length; i++) {
            var obj = this.stageInfo.getPlayerInfoArr()[i];
            if (obj && obj.id == playerId) {
                this.playerData = obj;
                cmd.emit(CommandId.fadeInPlayerPanel, obj, this.pid);
            }
        }
    };
    PlayerPanelInfo.prototype.hidePlayerPanel = function () {
        cmd.emit(CommandId.fadeOutPlayerPanel, null, this.pid);
    };
    PlayerPanelInfo.prototype.movePanel = function (param) {
        this.position = param;
        cmd.emit(CommandId.movePlayerPanel, param, this.pid);
    };
    return PlayerPanelInfo;
}(BasePanelInfo));
var ActivityPanelInfo = (function (_super) {
    __extends(ActivityPanelInfo, _super);
    function ActivityPanelInfo() {
        _super.apply(this, arguments);
    }
    ActivityPanelInfo.prototype.getInfo = function () {
        return {
            activityInfo: this.activityInfo
        };
    };
    ActivityPanelInfo.prototype.initInfo = function () {
        this.activityInfo = new ActivityInfo();
    };
    return ActivityPanelInfo;
}(BasePanelInfo));
var StagePanelInfo = (function (_super) {
    __extends(StagePanelInfo, _super);
    function StagePanelInfo(pid) {
        _super.call(this, pid);
        this.gameInfo = new GameInfo();
        this.gameInfo.playerDb = dbPlayerInfo();
        this.initCanvasNotice();
    }
    StagePanelInfo.prototype.initCanvasNotice = function () {
        var stageWidth = 8000;
        var stageHeight = 60;
        var canvas = document.getElementById("canvasNotice");
        canvas.setAttribute("width", stageWidth + "");
        canvas.setAttribute("height", stageHeight + "");
        var stage = new createjs.Stage(canvas);
        this.stageNotice = stage;
        return stage;
    };
    StagePanelInfo.prototype.getNoticeImg = function (content) {
        this.stageNotice.removeAllChildren();
        var noticeLabel = new createjs.Text(content, "35px Arial", "#fff");
        this.stageNotice.addChild(noticeLabel);
        var canvas = document.getElementById("canvasNotice");
        canvas.setAttribute("width", noticeLabel.getBounds().width + "");
        this.stageNotice.cache(0, 0, noticeLabel.getBounds().width, 60);
        this.stageNotice.update();
        var data = this.stageNotice.toDataURL('rgba(0,0,0,0)', "image/png");
        // base64ToPng('img/text.png', data);
        return data;
    };
    StagePanelInfo.prototype.getInfo = function () {
        return {
            leftScore: this.gameInfo.leftScore,
            rightScore: this.gameInfo.rightScore,
            time: this.gameInfo.time,
            state: this.gameInfo.timerState,
            ctnXY: this.ctnXY,
            playerInfoArr: this.getPlayerInfoArr()
        };
    };
    StagePanelInfo.prototype.getPlayerInfoArr = function () {
        return this.gameInfo.getPlayerInfoArr();
    };
    StagePanelInfo.prototype.addLeftScore = function () {
        this.gameInfo.leftScore = (this.gameInfo.leftScore + 1) % (this.gameInfo.winScore + 1);
        cmd.emit(CommandId.addLeftScore, this.gameInfo.leftScore, this.pid);
        this.gameInfo.straightScoreRight = 0;
        this.gameInfo.straightScoreLeft++;
        if (this.gameInfo.leftScore == 0)
            this.gameInfo.straightScoreLeft = 0;
        if (this.gameInfo.straightScoreLeft == 3) {
            console.log("straight score 3");
            cmd.emit(CommandId.straightScore3, { team: "left" }, this.pid);
        }
        if (this.gameInfo.straightScoreLeft == 5)
            cmd.emit(CommandId.straightScore5, { team: "left" }, this.pid);
    };
    StagePanelInfo.prototype.addRightScore = function () {
        this.gameInfo.rightScore = (this.gameInfo.rightScore + 1) % (this.gameInfo.winScore + 1);
        cmd.emit(CommandId.addRightScore, this.gameInfo.rightScore, this.pid);
        this.gameInfo.straightScoreLeft = 0;
        this.gameInfo.straightScoreRight++;
        if (this.gameInfo.rightScore == 0)
            this.gameInfo.straightScoreRight = 0;
        if (this.gameInfo.straightScoreRight == 3)
            cmd.emit(CommandId.straightScore3, { team: "right" }, this.pid);
        if (this.gameInfo.straightScoreRight == 5)
            cmd.emit(CommandId.straightScore5, { team: "right" }, this.pid);
    };
    StagePanelInfo.prototype.toggleTimer = function () {
        this.gameInfo.toggleTimer();
        cmd.emit(CommandId.toggleTimer, null, this.pid);
    };
    StagePanelInfo.prototype.resetTimer = function () {
        this.gameInfo.resetTimer();
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
        // this.playerInfoArr[pos] = param.playerInfo;
        this.gameInfo.setPlayerInfoByPos(pos, param.playerInfo);
        console.log(this, "updatePlayer", JSON.stringify(param.playerInfo), param.playerInfo.pos);
        cmd.emit(CommandId.updatePlayer, param, this.pid);
    };
    StagePanelInfo.prototype.showWinPanel = function (param) {
        var winTeam;
        if (param.mvp < 4) {
            winTeam = this.gameInfo.setLeftTeamWin();
        }
        else {
            winTeam = this.gameInfo.setRightTeamWin();
        }
        console.log("showWinPanel param:", param, "mvp:", param.mvp, this.getPlayerInfoArr());
        // console.log("win team:", JSON.stringify(winTeam.playerInfoArr));
        if (winTeam) {
            for (var i = 0; i < winTeam.playerInfoArr.length; i++) {
                var obj = winTeam.playerInfoArr[i];
                if (!obj)
                    return;
                if (obj.pos == param.mvp)
                    obj.isMvp = true;
                console.log(JSON.stringify(obj));
            }
            cmd.emit(CommandId.fadeInWinPanel, { mvp: param.mvp, playerDataArr: winTeam.playerInfoArr }, this.pid);
        }
        else {
        }
        // console.log(this, "after elo");
        // for (var i = 0; i < this.getPlayerInfoArr().length; i++) {
        //     var obj = this.getPlayerInfoArr()[i];
        //     console.log(JSON.stringify(obj));
        // }
    };
    StagePanelInfo.prototype.hideWinPanel = function (param) {
        cmd.emit(CommandId.fadeOutWinPanel, param, this.pid);
    };
    StagePanelInfo.prototype.updatePlayerAll = function (playerDataArr) {
        for (var i = 0; i < playerDataArr.length; i++) {
            var obj = playerDataArr[i];
            this.gameInfo.setPlayerInfoByPos(obj.pos, obj.playerData);
            console.log(this, "updatePlayer", JSON.stringify(obj.playerData), obj.pos);
        }
        cmd.emit(CommandId.updatePlayerAll, this.getPlayerInfoArr(), this.pid);
    };
    StagePanelInfo.prototype.notice = function (param) {
        param.img = this.getNoticeImg(param.notice);
        cmd.emit(CommandId.notice, param, this.pid);
    };
    return StagePanelInfo;
}(BasePanelInfo));
/// <reference path="./DbInfo.ts"/>
var ActivityInfo = (function () {
    function ActivityInfo() {
    }
    ActivityInfo.prototype.round = function () {
        var playerDataArr;
        dbPlayerInfo().getActivityPlayerDataArr(1, function (err, docs) {
            console.log("get Activity player arr", JSON.stringify(docs));
        });
    };
    return ActivityInfo;
}());
/**
 * Created by toramisu on 2016/5/13.
 */
/// <reference path="Config.ts"/>
/// <reference path="routes/PlayerInfoAdmin.ts"/>
/// <reference path="routes/ActivityAdmin.ts"/>
/// <reference path="models/DbInfo.ts"/>
/// <reference path="models/PanelInfo.ts"/>
/// <reference path="models/ActivityInfo.ts"/>
var msgpack = require("msgpack-lite");
var debug = require('debug')('express2:server');
var HttpServer = (function () {
    function HttpServer() {
        var _this = this;
        this.initEnv(function () {
            _this.initWebServer();
        });
    }
    HttpServer.prototype.getIPAddress = function () {
        var interfaces = require('os').networkInterfaces({ all: true });
        for (var devName in interfaces) {
            // console.log("interfaces:", devName);
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                // console.log("ip:", JSON.stringify(alias));
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    };
    HttpServer.prototype.initPanelInfo = function () {
        this.panel = new PanelInfo();
        console.log("init panel info", this.panel);
    };
    HttpServer.prototype.initEnv = function (callback) {
        fs.exists(M_path.join(appExecPath, 'nw.exe'), function (exists) {
            // handle result
            if (exists) {
                // dev env
                isDev = true;
            }
            else {
                isDev = false;
            }
            callback();
        });
    };
    HttpServer.prototype.initWebServer = function () {
        initDB();
        this.initPanelInfo();
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
        if (isDev) {
            app.use(express.static("."));
        }
        else {
            app.use(express.static(appExecPath));
        }
        var bodyParser = require('body-parser');
        // create application/x-www-form-urlencoded parser
        var urlencodedParser = bodyParser.urlencoded({
            extended: false,
            limit: '50mb'
        });
        app.use(bodyParser.json({ limit: '50mb' }));
        app.all("*", function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            if (req.method == 'OPTIONS') {
                res.send(200);
            }
            else {
                next();
            }
        });
        app.get('/', function (req, res) {
            res.render('dashboard');
        });
        app.get('/admin/player/:id', PlayerAdmin.showPlayerById);
        app.get('/admin/player/', PlayerAdmin.index);
        app.post('/admin/player/new', urlencodedParser, PlayerAdmin.newPlayer);
        app.post('/admin/player/update', urlencodedParser, PlayerAdmin.updatePlayerData);
        app.post('/admin/player/delete', urlencodedParser, PlayerAdmin.deletePlayerData);
        //activity admin
        // app.get('/admin/game/', ActivityAdmin.index);
        app.get('/admin/activity/:id', ActivityAdmin.index);
        app.post('/admin/activity/getActPlayer', urlencodedParser, ActivityAdmin.getActivityPlayerArr);
        app.post('/admin/game/genPrintPng', urlencodedParser, ActivityAdmin.genPrintPng);
        app.post('/admin/game/genActivity', urlencodedParser, ActivityAdmin.genActivity);
        app.post('/api/act/', urlencodedParser, ActivityAdmin.getActivityDateArr);
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
            var playerId = parseInt(req.params.playerId);
            console.log("PlayerInfo ", playerId);
            // var playerInfo = new PlayerInfo();
            dbPlayerInfo().find({ id: playerId }, function (err, doc) {
                if (err) {
                    console.log(err, "no player");
                    res.send(JSON.stringify({ playerInfo: "" }));
                }
                else {
                    var msg = JSON.stringify({ playerInfo: doc[0] });
                    console.log("find player", doc[0], msg);
                    res.send(msg);
                }
            });
        });
        //setup the web server
        app.server = http.createServer(app);
        //listen up
        app.server.listen(80, function () {
            //and... we're live
            console.log("wshost:", serverConf.host, "ws port:", serverConf.port);
        });
        this.initWebSocket();
        this.handleOp();
    };
    HttpServer.prototype.handleOp = function () {
        var _this = this;
        cmd.on(CommandId.cs_saveGameRec, function (param) {
            _this.panel.stage.gameInfo.saveGameRec();
        });
        cmd.on(CommandId.cs_fadeInPlayerPanel, function (param) {
            _this.panel.player.showPlayerPanel(param);
        });
        cmd.on(CommandId.cs_fadeOutPlayerPanel, function (param) {
            _this.panel.player.hidePlayerPanel();
        });
        cmd.on(CommandId.cs_movePlayerPanel, function (param) {
            _this.panel.player.movePanel(param);
        });
        //======================stage panel ==================
        cmd.on(CommandId.cs_notice, function (param) {
            _this.panel.stage.notice(param);
        });
        cmd.on(CommandId.cs_fadeInWinPanel, function (param) {
            _this.panel.stage.showWinPanel(param);
        });
        cmd.on(CommandId.cs_fadeOutWinPanel, function (param) {
            _this.panel.stage.hideWinPanel(param);
        });
        cmd.on(CommandId.cs_updatePlayerAll, function (param) {
            var idArr = [];
            for (var i = 0; i < param.length; i++) {
                var obj = param[i];
                idArr.push({ id: parseInt(obj.playerId) });
            }
            dbPlayerInfo().find({ $or: idArr }, function (err, playerDataArr) {
                console.log('find in db', err, playerDataArr, idArr);
                if (!err && playerDataArr.length) {
                    for (var i = 0; i < playerDataArr.length; i++) {
                        var playerData = playerDataArr[i];
                        for (var j = 0; j < param.length; j++) {
                            var obj = param[j];
                            if (obj.playerId == playerData.id) {
                                obj.playerData = playerData;
                                playerData.pos = obj.pos;
                            }
                        }
                    }
                    _this.panel.stage.updatePlayerAll(param);
                }
            });
            console.log(_this, "cs_updatePlayerAll");
        });
        cmd.on(CommandId.cs_updatePlayer, function (param) {
            _this.panel.stage.updatePlayer(param);
        });
        cmd.on(CommandId.cs_addLeftScore, function () {
            _this.panel.stage.addLeftScore();
        });
        cmd.on(CommandId.cs_addRightScore, function () {
            _this.panel.stage.addRightScore();
        });
        cmd.on(CommandId.cs_toggleTimer, function () {
            _this.panel.stage.toggleTimer();
        });
        cmd.on(CommandId.cs_resetTimer, function () {
            _this.panel.stage.resetTimer();
        });
        cmd.on(CommandId.cs_fadeOut, function () {
            _this.panel.stage.fadeOut();
        });
        cmd.on(CommandId.cs_stageFadeIn, function () {
            _this.panel.stage.fadeIn();
        });
        cmd.on(CommandId.cs_playerScore, function () {
            _this.panel.stage.playerScore();
        });
        cmd.on(CommandId.cs_moveStagePanel, function (param) {
            _this.panel.stage.movePanel(param);
        });
    };
    HttpServer.prototype.initWebSocket = function () {
        var _this = this;
        var url = require('url');
        var WebSocketServer = require('ws').Server, wss = new WebSocketServer({ port: serverConf.port });
        wss.on('connection', function (wsClient) {
            // var location = url.parse(wsClient.upgradeReq.url, true);
            // you might use location.query.access_token to authenticate or share sessions
            // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
            wsClient.on('message', function (message) {
                // var req = JSON.parse(message);
                var msg = msgpack.decode(message);
                console.log('client: ', msg);
                if (msg.req == "info") {
                    var pid = msg.pid;
                    wsClient.pid = pid;
                    var info;
                    if (msg.pid == PanelId.stagePanel)
                        info = _this.panel.stage.getInfo();
                    else if (pid == PanelId.playerPanel)
                        info = _this.panel.player.getInfo();
                    else if (pid == PanelId.actPanel)
                        info = _this.panel.act.getInfo();
                    wsClient.send(JSON.stringify({
                        res: "init",
                        param: info
                    }));
                }
                else if (msg.req == "op") {
                    cmd.emit(msg.param.type, msg.param.param);
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
    //new Test(cmd,appInfo);
});
//# sourceMappingURL=main.js.map