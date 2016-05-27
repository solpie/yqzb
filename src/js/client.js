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
var ElmId$ = {
    buttonAddLeftScore: "#btnAddLeftScore",
    buttonAddRightScore: "#btnAddRightScore"
};
var PanelId = {
    stagePanel: 'stage',
    winPanel: 'win',
    playerPanel: 'player'
};
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
/// <reference path="PlayerView.ts"/>
var PlayerPanelView = (function (_super) {
    __extends(PlayerPanelView, _super);
    function PlayerPanelView() {
        _super.apply(this, arguments);
    }
    PlayerPanelView.prototype.handle = function () {
    };
    PlayerPanelView.prototype.init = function (param) {
        _super.prototype.init.call(this, param);
        var ctn = new createjs.Container();
        this.ctn = ctn;
        this.stage.addChild(ctn);
        cmd.emit(CommandId.initPanel, param);
    };
    return PlayerPanelView;
}(BaseView));
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
    // winningPercent:number;
    // score:number;
    // name:string;
    // playerArr:Array<PlayerInfo>;
    // ret:Array<any>;
    // constructor(winPercentage?:number, scoreAvg?:number) {
    //     // this.winningPercent = winPercentage;
    //     this.score = scoreAvg;
    //     this.playerArr = [];
    // }
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
/// <reference path="views/StagePanelView.ts"/>
/// <reference path="views/PlayerPanelView.ts"/>
/// <reference path="../view/BaseView.ts"/>
/// <reference path="../model/Command.ts"/>
/// <reference path="../model/ElemID.ts"/>
/// <reference path="models/TeamInfo.ts"/>
var cmd = new Command();
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
        var viewMap = {};
        viewMap[PanelId.stagePanel] = StagePanelView;
        viewMap[PanelId.playerPanel] = PlayerPanelView;
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
