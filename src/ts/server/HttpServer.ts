/**
 * Created by toramisu on 2016/5/13.
 */
/// <reference path="Config.ts"/>
/// <reference path="routes/PlayerInfoAdmin.ts"/>

var msgpack = require("msgpack-lite");
var debug = require('debug')('express2:server');
var db:any;
function dbPlayerInfo() {
    return db.player;
}

class HttpServer {
    getIPAddress() {
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
    }


    initDB() {
        var Datastore = require('nedb');
// Fetch a collection to insert document into
        db = {};
        db.player = new Datastore({filename: 'db/player.db', autoload: true});
        // this.playerInfoCollection = db.collection("player_info");
        // this.playerInfoCollection.insert([{playerId: 1,name:"tmac"}, {playerId: 2,name:"curry"}]);
        // this.playerInfoCollection.findOne({playerId: 2}, function (err, playerInfo) {
        //     assert.equal(null, err);
        //     assert.equal('2', playerInfo.playerId);
        // });
        // console.log(this, "init db", this.playerInfoCollection);
///
// Insert a single document
//         collection.insert([{hello: 'world_safe1'}
//             , {hello: 'world_safe2'}], {w: 1}, function (err, result) {
//             assert.equal(null, err);
//
//             // Fetch the document
//             collection.findOne({hello: 'world_safe2'}, function (err, item) {
//                 assert.equal(null, err);
//                 assert.equal('world_safe2', item.hello);
//             })
//         });
    }

    constructor() {
        this.initDB();
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

        var bodyParser = require('body-parser');
        // create application/x-www-form-urlencoded parser
        var urlencodedParser = bodyParser.urlencoded({
            extended: false
            , limit: '50mb'
        });


        app.get('/', function (req, res) {
            res.render('dashboard');
        });

        app.get('/admin/player/:id', PlayerAdmin.showPlayer);

        app.post('/admin/player/new', urlencodedParser, PlayerAdmin.newPlayer);

        app.get('/admin/player/', (req, res)=> {
            dbPlayerInfo().find({}, function (err, docs) {
                var data:any = {adminId: 'playerList'};
                if (!err)
                    data.playerDataArr = docs;
                res.render('playerList', data);
                console.log("/admin/player/ length:", docs.length, JSON.stringify(data.playerDataArr));
            });
        });

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

    handleOp() {
        cmd.on(CommandId.cs_fadeInPlayerPanel, (param)=> {
            appInfo.panel.player.showWinPanel(param);
        });
        cmd.on(CommandId.cs_fadeOutPlayerPanel, (param)=> {
            appInfo.panel.player.hideWinPanel();
        });
        cmd.on(CommandId.cs_movePlayerPanel, (param)=> {
            appInfo.panel.player.movePanel(param);
        });
        //======================stage panel ==================
        cmd.on(CommandId.cs_fadeInWinPanel, (param)=> {
            appInfo.panel.stage.showWinPanel(param);
        });
        cmd.on(CommandId.cs_fadeOutWinPanel, (param)=> {
            appInfo.panel.stage.hideWinPanel(param);
        });

        cmd.on(CommandId.cs_updatePlayerAll, (param)=> {
            var idArr = [];
            // var idPosMap = {};
            for (var i = 0; i < param.length; i++) {
                var obj = param[i];
                // obj.src = 'data/' + obj.playerId + '.player';
                idArr.push({id: parseInt(obj.playerId)});
                // idPosMap[obj.playerId] = parseInt(obj.pos);
            }

            dbPlayerInfo().find({$or: idArr}, function (err, playerDataArr) {
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
                    appInfo.panel.stage.updatePlayerAll(param);
                }
            });
            console.log(this, "cs_updatePlayerAll");
        });
        cmd.on(CommandId.cs_updatePlayer, (param)=> {
            appInfo.panel.stage.updatePlayer(param);
        });
        cmd.on(CommandId.cs_addLeftScore, ()=> {
            appInfo.panel.stage.addLeftScore();
        });
        cmd.on(CommandId.cs_addRightScore, ()=> {
            appInfo.panel.stage.addRightScore();
        });
        cmd.on(CommandId.cs_toggleTimer, ()=> {
            appInfo.panel.stage.toggleTimer();
        });
        cmd.on(CommandId.cs_resetTimer, ()=> {
            appInfo.panel.stage.resetTimer();
        });
        cmd.on(CommandId.cs_fadeOut, ()=> {
            appInfo.panel.stage.fadeOut();
        });
        cmd.on(CommandId.cs_stageFadeIn, ()=> {
            appInfo.panel.stage.fadeIn();
        });
        cmd.on(CommandId.cs_playerScore, ()=> {
            appInfo.panel.stage.playerScore();
        });
        cmd.on(CommandId.cs_moveStagePanel, (param)=> {
            appInfo.panel.stage.movePanel(param);
        });
    }

    initWebSocket() {
        var url = require('url');
        var WebSocketServer = require('ws').Server
            , wss = new WebSocketServer({port: serverConf.port});

        wss.on('connection', function connection(wsClient) {
            // var location = url.parse(wsClient.upgradeReq.url, true);
            // you might use location.query.access_token to authenticate or share sessions
            // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
            wsClient.on('message', function incoming(message) {
                // var req = JSON.parse(message);
                var msg = msgpack.decode(message);
                console.log('client: ', msg);
                if (msg.req == "info") {
                    var pid = msg.pid;
                    wsClient.pid = pid;
                    var info;
                    if (msg.pid == PanelId.stagePanel)
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