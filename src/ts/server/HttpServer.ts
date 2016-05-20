/**
 * Created by toramisu on 2016/5/13.
 */
/// <reference path="Config.ts"/>

class HttpServer {
    playerInfoCollection:any;
    db:any;

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

    dbPlayerInfo() {
        return this.db.collection("player_info")
    }

    initDB() {
        var Engine = require('tingodb')().Db,
            assert = require('assert');
        var db = new Engine('db/tingodb', {});
// Fetch a collection to insert document into
        this.db = db;
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

        // respond with "hello world" when a GET request is made to the homepage
        app.get('/', function (req, res) {
            res.render('dashboard');
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

        app.post('/getPlayerInfo/:playerId', function (req, res) {
            var playerId = req.params.playerId;
            // var pos = req.params.pos;

            console.log("PlayerInfo ", playerId);
            // var playerInfo = new PlayerInfo();
            jsonfile.readFile("data/" + playerId + '.player', null, (err, confData)=> {
                if (err) {
                    console.log(err, "no player");
                    res.send(JSON.stringify({playerInfo: ""}));
                }
                else {
                    console.log("find player");
                    res.send(JSON.stringify({playerInfo: confData}));
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


        this.serverSend();
        this.handleOp();
    }

    handleOp() {
        cmd.on(CommandId.cs_updatePlayerAll, (param)=> {
            // var queue = new createjs.LoadQueue();
            // queue.on("complete", handleComplete, this);
            // var manifest = [];
            // //[{playerId:1,pos:1}]
            for (var i = 0; i < param.length; i++) {
                var obj = param[i];
                obj.src = 'data/' + obj.playerId + '.player';
            }
            queueFile(param, (err, param)=> {
                if (err) {

                }
                else {
                    console.log(this, "load all playerInfo");
                    // var data = [];
                    for (var i = 0; i < param.length; i++) {
                        var obj = param[i];
                        obj.playerInfo = obj.data;
                        // data.push(obj.data);
                        delete obj['data'];
                        console.log(this, "load playerInfo id:", obj.playerId, obj.playerInfo);
                    }
                    // this.dbPlayerInfo().insert(data);
                    appInfo.panel.stage.updatePlayerAll(param);
                }

            });
            // queue.loadManifest(manifest);
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

    serverSend() {
        var url = require('url');
        var WebSocketServer = require('ws').Server
            , wss = new WebSocketServer({port: serverConf.port});

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