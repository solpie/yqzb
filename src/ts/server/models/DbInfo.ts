/// <reference path="../../Node.ts"/>

/////
var appExecPath = M_path.dirname(process.execPath);
var isDev;
//path for external
function pathEx(p) {
    return isDev ? p : M_path.join(appExecPath, p);
}
/////////////////
var db:any;
function dbPlayerInfo() {
    return db.player;
}
function dbActivityInfo() {
    return db.activity;
}

// var Document = require('camo').Document;
var Datastore = require('nedb');

class BaseDB {
    dataStore:any;
    // onload:any;
    config:any;
    dbPath:string;

    constructor(option) {
        this.dbPath = option.filename;
        // this.onload = option.onload;
        // option.onload = this.init;

        this.dataStore = new Datastore(option);
        this.dataStore.find({id: 0}, (err, docs) => {
            console.log('find config', this.dbPath);
            if (!err) {
                if (docs.length)
                    this.config = docs[0];
                else
                    this.init();
            }
        });
    }

    init() {
        this.dataStore.insert({id: 0, idUsed: 1}, (err, newDoc) => {
            console.log('onload inti db config', this.dbPath);
            console.log(this, JSON.stringify(newDoc));
            this.config = newDoc;
        });
    }
}

class ActivityDB extends BaseDB {
    addActivity(data) {
    }
}
class GameDB extends BaseDB {

}
function initDB() {
// Fetch a collection to insert document into
    var playerDb:string = pathEx('db/player.db');
    var activityDb:string = pathEx('db/activity.db');
    var gameDbPath:string = pathEx('db/game.db');

    db = {};
    db.player = new Datastore({filename: playerDb, autoload: true});
    db.activity = new ActivityDB({filename: activityDb, autoload: true});
    // db.game = new GameDB({filename: gameDbPath, autoload: true});

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