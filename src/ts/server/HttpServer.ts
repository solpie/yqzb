/**
 * Created by toramisu on 2016/5/13.
 */
/// <reference path="Config.ts"/>

class HttpServer {
    constructor() {
        ///server
        var http = require('http');
        var path = require('path');

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

        app.get('/panel/:id/:op', function (req, res) {
            var pid = req.params.id;
            var op = req.params.op;
            // if (pid == "stage") {
            res.render('panel', {pid: pid, op: op});
            // }
            // else {
            //     res.send(pid);
            // }
        });

        app.post('/getPlayerInfo/:playerId', function (req, res) {
            var playerId = req.params.playerId;
            console.log("PlayerInfo ", playerId);
            var playerInfo;
            res.send(JSON.stringify({playerInfo: playerInfo}));
        });

        app.post('/getPlayerInfo/:playerId', function (req, res) {
            var playerId = req.params.playerId;
            console.log("PlayerInfo ", playerId);
        });


//setup the web server
        app.server = http.createServer(app);
        //listen up
        app.server.listen(80, function () {
            //and... we're live
            console.log('Server is running');
        });
        this.serverSend();
        this.handleOp();
    }

    handleOp() {
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
    }

    serverSend() {
        var url = require('url');
        var WebSocketServer = require('ws').Server
            , wss = new WebSocketServer({port: serverConf.port});


        wss.on('connection', function connection(wsClient) {
            var location = url.parse(wsClient.upgradeReq.url, true);
            // you might use location.query.access_token to authenticate or share sessions
            // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
            console.log(location);
            wsClient.on('message', function incoming(message) {
                console.log('client: ', message);
                var req = JSON.parse(message);
                if (req.param == PanelId.stagePanel) {
                    wsClient.pid = req.param;
                    // console.log('received: %s', message);
                    wsClient.send(JSON.stringify({
                        res: "init",
                        param: {
                            leftScore: appInfo.panel.stage.leftScore,
                            rightScore: appInfo.panel.stage.rightScore,
                            time: appInfo.panel.stage.time,
                            state: appInfo.panel.stage.timerState,
                        }
                    }));
                }
                else if (req.req == "op") {
                    // wss.broadcast(req.pid, req.param.type, req.param.param);
                    cmd.emit(req.param.type, req.param.param);

                }
            });
            // wss.broadcast = function broadcastCmd(pid, cmdId, param) {
            //     var strData = JSON.stringify({res: "cmd",pid:pid, cmd: cmdId, param: param});
            //     console.log("server:", strData);
            //     wss.clients.forEach(function each(client) {
            //         console.log("client.pid:", client.pid);
            //         if (client.pid == pid)
            //             client.send(strData);
            //     });
            // };
            wsClient.send(JSON.stringify({res: "keep"}));
        });


        cmd.broadcast = function broadcastCmd(pid, cmdId, param) {
            var strData = JSON.stringify({res: "cmd",pid:pid, cmd: cmdId, param: param});
            console.log("server:", strData);
            wss.clients.forEach(function each(client) {
                console.log("client.pid:", client.pid);
                if (client.pid == pid)
                    client.send(strData);
            });
        };
    }

}