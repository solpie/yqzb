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

        app.post('/getPlayerInfo', function (req, res) {
            var playerId = req.body.id;
            console.log("PlayerInfo ", playerId);
        });

        var postToCmd = function (route, cmdId) {
            app.post(route, function (req, res) {
                cmd.emit(cmdId);
                res.send("sus");
            });
        };
        //top panel
        postToCmd('/addLeftScore', CommandId.addLeftScore);
        postToCmd('/addRightScore', CommandId.addRightScore);
        postToCmd('/toggleTimer', CommandId.toggleTimer);
        postToCmd('/resetTimer', CommandId.resetTimer);

//setup the web server
        app.server = http.createServer(app);
        //listen up
        app.server.listen(80, function () {
            //and... we're live
            console.log('Server is running on port ' + 80);
        });
    }
}