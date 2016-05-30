/**
 * Created by toramisu on 2016/5/13.
 */
/// <reference path="Config.ts"/>
/// <reference path="routes/PlayerInfoAdmin.ts"/>
/// <reference path="routes/ActivityAdmin.ts"/>
/// <reference path="models/DbInfo.ts"/>
/// <reference path="models/PanelInfo.ts"/>
/// <reference path="models/RoundInfo.ts"/>
/// <reference path="../model/ElemID.ts"/>

var msgpack = require("msgpack-lite");
var debug = require('debug')('express2:server');


class HttpServer {
    panel:PanelInfo;

    getIPAddress() {
        var interfaces = require('os').networkInterfaces({all: true});
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
    }

    initPanelInfo() {
        this.panel = new PanelInfo();
        console.log("init panel info", this.panel);
    }


    initEnv(callback) {
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
    }

    initWebServer() {
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
            extended: false
            , limit: '50mb'
        });
        app.use(bodyParser.json({limit: '50mb'}));

        app.all("*", function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            if (req.method == 'OPTIONS') {
                res.send(200);
            } else {
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
        app.post('/admin/game/genRound', urlencodedParser, ActivityAdmin.genRound);
        
        app.post('/op/act/', urlencodedParser, ActivityAdmin.opHandle);


        app.get('/panel/:id/:op', function (req, res) {
            var pid = req.params.id;
            var op = req.params.op;
            var data = {pid: pid, op: op, host: serverConf.host, port: serverConf.port};
            var s1 = JSON.stringify(data);
            var s2 = s1.substr(0, s1.length - 1) + ',"' + pid + '":1}';
            data = JSON.parse(s2);
            res.render('panel', data);
        });

        app.post('/getPlayerInfo/:playerId', (req, res) => {
            var playerId:number = parseInt(req.params.playerId);
            console.log("PlayerInfo ", playerId);
            // var playerInfo = new PlayerInfo();
            dbPlayerInfo().find({id: playerId}, function (err, doc) {
                if (err) {
                    console.log(err, "no player");
                    res.send(JSON.stringify({playerInfo: ""}));
                }
                else {
                    var msg = JSON.stringify({playerInfo: doc[0]});
                    console.log("find player", doc[0], msg);
                    res.send(msg);
                }
            });
        });

//setup the web server
        app.server = http.createServer(app);
        //listen up
        app.server.listen(80, ()=> {
            //and... we're live
            console.log("wshost:", serverConf.host, "ws port:", serverConf.port);
        });


        this.initWebSocket();
        this.handleOp();
    }

    constructor() {
        this.initEnv(()=> {
            this.initWebServer();
        });
    }

    handleOp() {
        cmd.on(CommandId.cs_saveGameRec, (param)=> {
            this.panel.stage.gameInfo.saveGameRec();
        });
        cmd.on(CommandId.cs_fadeInPlayerPanel, (param)=> {
            this.panel.player.showPlayerPanel(param);
        });
        cmd.on(CommandId.cs_fadeOutPlayerPanel, (param)=> {
            this.panel.player.hidePlayerPanel();
        });
        cmd.on(CommandId.cs_movePlayerPanel, (param)=> {
            this.panel.player.movePanel(param);
        });
        //======================stage panel ==================
        cmd.on(CommandId.cs_notice, (param)=> {
            this.panel.stage.notice(param);
        });

        cmd.on(CommandId.cs_fadeInWinPanel, (param)=> {
            this.panel.stage.showWinPanel(param);
        });
        cmd.on(CommandId.cs_fadeOutWinPanel, (param)=> {
            this.panel.stage.hideWinPanel(param);
        });

        cmd.on(CommandId.cs_updatePlayerAll, (param)=> {
            var idArr = [];
            for (var i = 0; i < param.length; i++) {
                var obj = param[i];
                idArr.push({id: parseInt(obj.playerId)});
            }

            dbPlayerInfo().find({$or: idArr}, (err, playerDataArr)=> {
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
                    this.panel.stage.updatePlayerAll(param);
                }
            });
            console.log(this, "cs_updatePlayerAll");
        });
        cmd.on(CommandId.cs_updatePlayer, (param)=> {
            this.panel.stage.updatePlayer(param);
        });
        cmd.on(CommandId.cs_addLeftScore, ()=> {
            this.panel.stage.addLeftScore();
        });
        cmd.on(CommandId.cs_addRightScore, ()=> {
            this.panel.stage.addRightScore();
        });
        cmd.on(CommandId.cs_toggleTimer, ()=> {
            this.panel.stage.toggleTimer();
        });
        cmd.on(CommandId.cs_resetTimer, ()=> {
            this.panel.stage.resetTimer();
        });
        cmd.on(CommandId.cs_fadeOut, ()=> {
            this.panel.stage.fadeOut();
        });
        cmd.on(CommandId.cs_stageFadeIn, ()=> {
            this.panel.stage.fadeIn();
        });
        cmd.on(CommandId.cs_playerScore, ()=> {
            this.panel.stage.playerScore();
        });
        cmd.on(CommandId.cs_moveStagePanel, (param)=> {
            this.panel.stage.movePanel(param);
        });
    }

    initWebSocket() {
        var url = require('url');
        var WebSocketServer = require('ws').Server
            , wss = new WebSocketServer({port: serverConf.port});

        wss.on('connection', (wsClient)=> {
            // var location = url.parse(wsClient.upgradeReq.url, true);
            // you might use location.query.access_token to authenticate or share sessions
            // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
            wsClient.on('message', (message)=> {
                // var req = JSON.parse(message);
                var msg = msgpack.decode(message);
                console.log('client: ', msg);
                if (msg.req == "info") {
                    var pid = msg.pid;
                    wsClient.pid = pid;
                    var info;
                    if (msg.pid == PanelId.stagePanel)
                        info = this.panel.stage.getInfo();
                    else if (pid == PanelId.playerPanel)
                        info = this.panel.player.getInfo();
                    else if (pid == PanelId.actPanel)
                        info = this.panel.act.getInfo();
                    wsClient.send(JSON.stringify({
                        res: "init",
                        param: info
                    }));
                }
                else if (msg.req == "op") {
                    cmd.emit(msg.param.type, msg.param.param);
                }
            });
            wsClient.send(JSON.stringify({res: "keep"}));
        });


        cmd.broadcast = function broadcastCmd(pid, cmdId, param) {
            var strData = JSON.stringify({res: "cmd", pid: pid, cmd: cmdId, param: param});
            console.log("server:", strData);
            wss.clients.forEach(function each(client) {
                if (client.pid === pid)
                    client.send(strData);
            });
        };
    }

}