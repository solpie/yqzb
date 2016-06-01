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
    port: 8086,
    staticPath: "."
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
    CommandId[CommandId["notice"] = 100028] = "notice";
    CommandId[CommandId["cs_notice"] = 100029] = "cs_notice";
    CommandId[CommandId["cs_resetGame"] = 100030] = "cs_resetGame";
    //-----------------win panel
    CommandId[CommandId["fadeInWinPanel"] = 100031] = "fadeInWinPanel";
    CommandId[CommandId["cs_fadeInWinPanel"] = 100032] = "cs_fadeInWinPanel";
    CommandId[CommandId["fadeOutWinPanel"] = 100033] = "fadeOutWinPanel";
    CommandId[CommandId["cs_fadeOutWinPanel"] = 100034] = "cs_fadeOutWinPanel";
    CommandId[CommandId["saveGameRec"] = 100035] = "saveGameRec";
    CommandId[CommandId["cs_saveGameRec"] = 100036] = "cs_saveGameRec";
    //---------------- player panel
    CommandId[CommandId["cs_queryPlayerByPos"] = 100037] = "cs_queryPlayerByPos";
    CommandId[CommandId["fadeInPlayerPanel"] = 100038] = "fadeInPlayerPanel";
    CommandId[CommandId["cs_fadeInPlayerPanel"] = 100039] = "cs_fadeInPlayerPanel";
    CommandId[CommandId["fadeOutPlayerPanel"] = 100040] = "fadeOutPlayerPanel";
    CommandId[CommandId["cs_fadeOutPlayerPanel"] = 100041] = "cs_fadeOutPlayerPanel";
    CommandId[CommandId["movePlayerPanel"] = 100042] = "movePlayerPanel";
    CommandId[CommandId["cs_movePlayerPanel"] = 100043] = "cs_movePlayerPanel";
    //自动三杀事件
    CommandId[CommandId["straightScore3"] = 100044] = "straightScore3";
    CommandId[CommandId["straightScore5"] = 100045] = "straightScore5";
    CommandId[CommandId["initPanel"] = 100046] = "initPanel";
    /////activity panel
    CommandId[CommandId["cs_fadeInActPanel"] = 100047] = "cs_fadeInActPanel";
    CommandId[CommandId["fadeInActPanel"] = 100048] = "fadeInActPanel";
    CommandId[CommandId["cs_fadeOutActPanel"] = 100049] = "cs_fadeOutActPanel";
    CommandId[CommandId["fadeOutActPanel"] = 100050] = "fadeOutActPanel";
    CommandId[CommandId["cs_startGame"] = 100051] = "cs_startGame";
    CommandId[CommandId["cs_fadeInRankPanel"] = 100052] = "cs_fadeInRankPanel";
    CommandId[CommandId["fadeInRankPanel"] = 100053] = "fadeInRankPanel";
    CommandId[CommandId["cs_fadeOutRankPanel"] = 100054] = "cs_fadeOutRankPanel";
    CommandId[CommandId["fadeOutRankPanel"] = 100055] = "fadeOutRankPanel";
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
            if (playerData['playerData'] != null) {
                this.playerData = obj2Class(playerData.playerData, PlayerData);
                this.setPlayerInfofromData(playerData);
            }
            else {
                this.playerData = obj2Class(playerData, PlayerData);
                this.setPlayerInfofromData(playerData);
            }
        }
    }
    PlayerInfo.prototype.setPlayerInfofromData = function (data) {
        if (data['isRed'] != null)
            this.isRed = data.isRed;
        if (data['isMvp'] != null)
            this.isMvp = data.isMvp;
        if (data['backNumber'] != null)
            this.backNumber = data.backNumber;
    };
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
        this.winpercent(this.getCurWinningPercent());
    };
    PlayerInfo.prototype.getCurWinningPercent = function () {
        return this.winGameCount() / (this.loseGameCount() + this.winGameCount());
    };
    return PlayerInfo;
}(BaseInfo));
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
/// <reference path="../lib.ts"/>
/// <reference path="Config.ts"/>
/// <reference path="../model/Command.ts"/>
/// <reference path="../model/ElemID.ts"/>
/// <reference path="models/TeamInfo.ts"/>
var cmd = new Command();
var BaseCanvasView = (function () {
    function BaseCanvasView(stage, isOp) {
        this.stageWidth = 1920;
        this.stageHeight = 1080;
        this.isOp = false;
        this.stage = stage;
        this.isOp = isOp;
    }
    BaseCanvasView.prototype.init = function (param) {
        var ctn = new createjs.Container();
        this.ctn = ctn;
        this.stage.addChild(ctn);
        cmd.emit(CommandId.initPanel, param);
    };
    BaseCanvasView.prototype.initOp = function () {
        $(".inputPanel").show();
    };
    BaseCanvasView.prototype.newBtn = function (func, text) {
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
    return BaseCanvasView;
}());
var Client = (function () {
    function Client(pid, isOB, host, port) {
        this.pid = pid;
        this.initWsClient(pid, host, port);
        this.isOB = isOB;
    }
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
            // relinkTimer = setInterval(relink, 1);
        };
        wsc.onerror = function (event) {
            console.log(event);
        };
        cmd.proxy = function (type, param) {
            wsc.send(msgpack.encode({ req: "op", pid: pid, param: { type: type, param: param } }));
        };
        return wsc;
    };
    Client.prototype.initPanel = function (pid, param) {
        var stage = this.initCanvas();
        this.panel = new BaseCanvasView(stage, this.isOB);
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
