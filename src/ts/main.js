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
var Container = createjs.Container;
var TrackerView = (function (_super) {
    __extends(TrackerView, _super);
    function TrackerView(stage, isClient) {
        var _this = this;
        _super.call(this, stage, isClient);
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
/// <reference path="StagePanelView.ts"/>
/// <reference path="TrackerView.ts"/>
var Stage = createjs.Stage;
var StageView = (function () {
    function StageView() {
        //this.canvasEl = document.getElementById("stage");
        //this.canvasEl.setAttribute("width", 800 + "");
        //this.canvasEl.setAttribute("height", 300 + "");
        //this.ctx = this.canvasEl.getContext("2d");
        /////////draw bar
        //this._fillRect("#ffff00", 0, 0, 800, 300);
        //this.test()
        var _this = this;
        this.stageWidth = 1200;
        this.stageHeight = 800;
        ////createjs
        this.canvas = document.getElementById("stage");
        this.canvas.setAttribute("width", this.stageWidth + "");
        this.canvas.setAttribute("height", this.stageHeight + "");
        this.stage = new createjs.Stage(this.canvas);
        this.stage.autoClear = true;
        //stage bg
        //var bgRed = new createjs.Shape();
        //bgRed.graphics.beginFill("#ff0000");
        //bgRed.graphics.beginFill("#2b2b2b");
        //bgRed.graphics.drawRect(0, 0, this.stageWidth, this.stageHeight);
        //bgRed.graphics.endFill();
        //this.stage.addChild(bgRed);
        //add mod
        this.panelView = new TopPanelView(this.stage, false);
        this.trackerView = new TrackerView(this.stage, false);
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
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", function () {
            _this.stage.update(event);
        });
    }
    StageView.prototype.init = function () {
    };
    StageView.prototype.test = function () {
        //var image = new Image();
        //image.onload = ()=> {
        //    //this.ctx.drawImage(image, 0, 60, 53, 53);
        //    //this.ctx.drawImage(image, 0, 0, 53, 80, 10, 10, 53, 80);
        //    //this._drawImage(image, 50, 50, 586, 111, 0, 0);
        //
        //    var posy = 0;
        //    var tween = TweenLite.to(image, 2, {
        //        paused: true,
        //        setFilterRadius: 0,
        //        onUpdate: ()=> {
        //            this.ctx.clearRect(0, 0, 800, 300);
        //            this._drawImage(image, posy, 5, 586, 111, 0, 0);
        //            posy += 1;
        //            console.log(posy);
        //        }
        //    });
        //    //tween.play();
        //};
        ////image.src = "img/digits.png";
        //image.src = "img/panel.png";
        //TweenLite.to("#img2", 2, {left: 200, opacity: 0}).play();
        //TweenLite.to("#quote", 2, {
        //    left: 200, opacity: 0, onUpdate: ()=> {
        //    }
        //}).play();
    };
    StageView.prototype.addScore = function () {
    };
    return StageView;
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
        $("#btnClose").on(MouseEvt.CLICK, function () {
            win.close();
        });
        $("#btnDbg").on(MouseEvt.CLICK, function () {
            win.showDevTools('', true);
        });
        ///dashboard
        //var win = gui.Window.open ('panel.html', {
        //    position: 'center',
        //    toolbar: false,
        //    width: 901,
        //    height: 523
        //});
        //
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
        else if (key = 123) {
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
/// <reference path="StagePanelView.ts"/>
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
        function initCamera() {
            if (navigator.webkitGetUserMedia) {
                navigator.webkitGetUserMedia({ video: true }, onSuccess, onFail);
            }
            else {
                alert('webRTC not available');
            }
        }
        function onSuccess(stream) {
            document.getElementById('camFeed').src = webkitURL.createObjectURL(stream);
        }
        function onFail() {
            alert('could not connect stream');
        }
        // initCamera();
    }
    YuanqiTvView.prototype.run = function () {
        this.winView = new WindowView();
        this.stageView = new StageView();
        console.log("run");
    };
    return YuanqiTvView;
}());
/**
 * Created by toramisu on 2016/5/13.
 */
var HttpServer = (function () {
    function HttpServer() {
        ///server
        var http = require('http');
        var path = require('path');
        //var fs = require('fs');
        //var index = fs.readFileSync('index.html');
        //http.createServer(function (req, res) {
        //    //res.writeHead(200, {'Content-Type': 'text/plain'});
        //    console.log(req);
        //    res.end(index);
        //}).listen(80);
        var express = require('express');
        var app = express();
        // view engine setup
        app.set('views', "./views");
        app.set('view engine', 'ejs');
        app.use(express.static("."));
        // respond with "hello world" when a GET request is made to the homepage
        app.get('/', function (req, res) {
            res.render('dashboard');
        });
        app.get('/panel/:id', function (req, res) {
            var pid = req.params.id;
            if (pid == "stage") {
                res.render('panel', { pid: PanelId.stagePanel });
            }
            else {
                res.send(pid);
            }
        });
        app.post('/getPlayerInfo', function (req, res) {
            var playerId = req.body.id;
            console.log("PlayerInfo ", playerId);
        });
        // var postToCmd = function (route, cmdId) {
        //     app.post(route, function (req, res) {
        //         cmd.emit(cmdId);
        //         res.send("sus");
        //     });
        // };
        // //top panel
        // postToCmd('/addLeftScore', CommandId.addLeftScore);
        // postToCmd('/addRightScore', CommandId.addRightScore);
        // postToCmd('/toggleTimer', CommandId.toggleTimer);
        // postToCmd('/resetTimer', CommandId.resetTimer);
        //setup the web server
        app.server = http.createServer(app);
        //listen up
        app.server.listen(80, function () {
            //and... we're live
            console.log('Server is running on port ' + 80);
        });
        this.serverSend();
    }
    HttpServer.prototype.serverSend = function () {
        var url = require('url');
        var WebSocketServer = require('ws').Server, wss = new WebSocketServer({ port: 8080 });
        wss.on('connection', function connection(ws) {
            var location = url.parse(ws.upgradeReq.url, true);
            // you might use location.query.access_token to authenticate or share sessions
            // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
            console.log(location);
            ws.on('message', function incoming(message) {
                console.log('received: %s', message);
                var req = JSON.parse(message);
                if (req.param == PanelId.stagePanel) {
                    // console.log('received: %s', message);
                    wss.broadcast({
                        res: "init",
                        param: {
                            leftScore: appInfo.panelInfo.stagePanelInfo.leftScore,
                            rightScore: appInfo.panelInfo.stagePanelInfo.rightScore,
                            time: appInfo.panelInfo.stagePanelInfo.time,
                            state: appInfo.panelInfo.stagePanelInfo.timerState
                        }
                    });
                }
            });
            ws.send(JSON.stringify({ res: "keep" }));
        });
        wss.broadcast = function broadcast(data) {
            var strData = JSON.stringify(data);
            console.log("server:", strData);
            wss.clients.forEach(function each(client) {
                client.send(strData);
            });
        };
        cmd.broadCast = function broadcastCmd(cmdId, param) {
            var strData = JSON.stringify({ res: "cmd", cmd: cmdId, param: param });
            console.log("server:", strData);
            wss.clients.forEach(function each(client) {
                client.send(strData);
            });
        };
        // cmd.on(CommandId.addLeftScore, ()=> {
        //     wss.broadcast({op: "addLeftScore"});
        // });
    };
    return HttpServer;
}());
/// <reference path="JQuery.ts"/>
/// <reference path="model/AppInfo.ts"/>
/// <reference path="model/Command.ts"/>
/// <reference path="view/AppView.ts"/>
/// <reference path="server/HttpServer.ts"/>
var cmd = new Command();
var appInfo = new AppInfo();
var app;
var server = new HttpServer();
$(function () {
    app = new YuanqiTvView(appInfo);
    app.run();
    //new Test(cmd,appInfo);
});
