/// <reference path="../../Node.ts"/>
var appExecPath = M_path.dirname(process.execPath);
var isDev;
var db:any;
function dbPlayerInfo() {
    return db.player;
}
function dbActivityInfo() {
    return db.activity;
}
function initDB() {
    var Datastore = require('nedb');
// Fetch a collection to insert document into
    var playerDb:string = 'db/player.db';
    var activityDb:string = 'db/activity.db';

    if (!isDev) {
        playerDb = M_path.join(appExecPath, playerDb);
        activityDb = M_path.join(appExecPath, activityDb);
    }
    db = {};
    db.player = new Datastore({filename: playerDb, autoload: true});
    db.activity = new Datastore({filename: activityDb, autoload: true});

    db.player.find({id: 0}, function (err, doc) {
        db.player.config = doc[0];
    });
    db.player.saveIdUsed = function () {
        db.player.config.playerIdUsed++;
        db.player.update({id: 0}, {$set: db.player.config})
    };
    db.player.getNewId = function () {
        return db.player.config.playerIdUsed;
    };
    db.player.getActivityPlayerDataArr = function (actId, callback) {
        db.player.find({$not: {id: 0}, activityId: actId}).sort({eloScore: 1}).exec(function (err, docs) {
            callback(err, docs);
        });
    };
    // db.player.getActivityPlayerDataArr(1, function (err, docs) {
    //     console.log("actPlayer:", JSON.stringify(docs));
    // });
    // var playerDb:string = M_path.join(appPath, 'db/player.db');
    // var activityDb:string = M_path.join(appPath, 'db/activity.db');
    console.log(process.cwd());
    // Get path of project binary:
    console.log(M_path.dirname(process.execPath));
}