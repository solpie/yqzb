/**
 * Created by toramisu on 2016/5/13.
 */
class HttpServer {
    constructor() {
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
                res.render('panel', {pid: PanelId.stagePanel});
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

    serverSend() {
        var url = require('url');
        var WebSocketServer = require('ws').Server
            , wss = new WebSocketServer({port: 8080});
        wss.on('connection', function connection(ws) {
            var location = url.parse(ws.upgradeReq.url, true);
            // you might use location.query.access_token to authenticate or share sessions
            // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

            ws.on('message', function incoming(message) {
                console.log('received: %s', message);
            });

            ws.send(JSON.stringify({op: "keep"}));
        });

        wss.broadcast = function broadcast(data) {
            var strData = JSON.stringify(data);
            console.log("server:", strData);
            wss.clients.forEach(function each(client) {
                client.send(strData);
            });
        };

        cmd.broadCast = function broadcastCmd(cmdId, param) {
            var strData = JSON.stringify({cmd: cmdId, param: param});
            console.log("server:", strData);
            wss.clients.forEach(function each(client) {
                client.send(strData);
            });
        };
        // cmd.on(CommandId.addLeftScore, ()=> {
        //     wss.broadcast({op: "addLeftScore"});
        // });
    }

}