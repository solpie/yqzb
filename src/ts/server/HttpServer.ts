/**
 * Created by toramisu on 2016/5/13.
 */
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
            if (pid == "stage") {
                res.render('panel', {pid: PanelId.stagePanel, op: op});
            }
            else {
                res.send(pid);
            }
        });

        app.post('/getPlayerInfo/:playerId', function (req, res) {
            var playerId = req.params.playerId;
            console.log("PlayerInfo ", playerId);
            var playerInfo;
            res.send(JSON.stringify({playerInfo:playerInfo}));
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
            , wss = new WebSocketServer({port: 8080});
        wss.on('connection', function connection(ws) {
            var location = url.parse(ws.upgradeReq.url, true);
            // you might use location.query.access_token to authenticate or share sessions
            // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
            console.log(location);
            ws.on('message', function incoming(message) {
                console.log('client: ', message);
                var req = JSON.parse(message);
                if (req.param == PanelId.stagePanel) {
                    // console.log('received: %s', message);
                    ws.send(JSON.stringify({
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
                    cmd.emit(req.param.type, req.param.param);
                }
            });

            ws.send(JSON.stringify({res: "keep"}));
        });
        wss.broadcast = function broadcast(data) {
            var strData = JSON.stringify(data);
            console.log("server:", strData);
            wss.clients.forEach(function each(client) {
                client.send(strData);
            });
        };

        cmd.broadCast = function broadcastCmd(cmdId, param) {
            var strData = JSON.stringify({res: "cmd", cmd: cmdId, param: param});
            console.log("server:", strData);
            wss.clients.forEach(function each(client) {
                client.send(strData);
            });
        };
    }

}