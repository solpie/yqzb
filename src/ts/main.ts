/// <reference path="JQuery.ts"/>
/// <reference path="utils/JSONFile.ts"/>
/// <reference path="model/AppInfo.ts"/>
/// <reference path="model/Command.ts"/>
/// <reference path="view/AppView.ts"/>
/// <reference path="server/HttpServer.ts"/>
var cmd:Command = new Command();
var appInfo = new AppInfo();


var server;
// jsonfile.readFile("config.json", null, (err, confData)=> {
//     if (confData.server['host'])
//         serverConf.host = confData.server['host'];
//     if (confData.server['wsPort'])
//         serverConf.port = confData.server['wsPort'];
//     server = new HttpServer();
// });

server = new HttpServer();


var app:YuanqiTvView;
appInfo.isServer = true;
appInfo.savePlayerInfo = function (playerInfo) {
    if (playerInfo.id())
        jsonfile.writeFile("data/" + playerInfo.id() + '.player', playerInfo.playerData, null, (err, confData)=> {
        });
    else
        throw Error("no player id!!!");
};
appInfo.parsePlayerInfo = function () {


};
$(() => {
    app = new YuanqiTvView(appInfo);
    app.run();
    //new Test(cmd,appInfo);
});