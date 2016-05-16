/// <reference path="JQuery.ts"/>
/// <reference path="utils/JSONFile.ts"/>
/// <reference path="model/AppInfo.ts"/>
/// <reference path="model/Command.ts"/>
/// <reference path="view/AppView.ts"/>
/// <reference path="server/HttpServer.ts"/>
var cmd:Command = new Command();
var appInfo = new AppInfo();
var app:YuanqiTvView;

var server;
jsonfile.readFile("config.json", null, (err, confData)=> {

    serverConf.host = confData.server.host;
    serverConf.port = confData.server.wsPort;
    console.log("host:", serverConf.host,"ws port:",serverConf.port);
    server = new HttpServer();
});
appInfo.isServer = true;

$(() => {
    app = new YuanqiTvView(appInfo);
    app.run();
    //new Test(cmd,appInfo);
});