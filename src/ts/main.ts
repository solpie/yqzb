/// <reference path="JQuery.ts"/>
/// <reference path="model/AppInfo.ts"/>
/// <reference path="model/Command.ts"/>
/// <reference path="view/AppView.ts"/>
/// <reference path="server/HttpServer.ts"/>
var cmd:Command = new Command();
var appInfo = new AppInfo();
var app:YuanqiTvView;
var server = new HttpServer();
appInfo.isServer = true;

$(() => {
    app = new YuanqiTvView(appInfo);
    app.run();
    //new Test(cmd,appInfo);
});