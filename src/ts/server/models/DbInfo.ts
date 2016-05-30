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
    return db.player.dataStore;
}
function dbActivityInfo() {
    return db.activity;
}

// var Document = require('camo').Document;
var Datastore = require('nedb');

class BaseDB {
    dataStore:any;
    config:any;
    dbPath:string;

    constructor(option) {
        this.dbPath = option.filename;
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
        this.onloaded();
    }

    onloaded() {
    };

    init() {
        this.dataStore.insert({id: 0, idUsed: 1}, (err, newDoc) => {
            console.log('onload inti db config');
            console.log(this, JSON.stringify(newDoc));
            this.config = newDoc;
        });
    }

    saveIdUsed() {
        this.config.idUsed++;
        this.dataStore.update({id: 0}, {$set: this.config});
    };
}

class ActivityDB extends BaseDB {
    addActivity(data) {
        data.date = this.config.idUsed;
        this.dataStore.insert(data, (err, newDoc) => {
            if (!err) {
                this.saveIdUsed();
            }
        })
    }

    getDateArrByActivityId(actId, callback) {
        this.dataStore.find({activityId: actId}, function (err, docs) {
            callback(docs);
        });
    }
}
class GameDB extends BaseDB {

}
class PlayerDB extends BaseDB {
    getNewId() {
        return this.config.idUsed;
    }

    getActivityPlayerDataArr(actId, callback) {
        this.dataStore.find({$not: {id: 0}, activityId: actId}).sort({eloScore: 1}).exec(function (err, docs) {
            callback(err, docs);
        });
    }

    getPlayerDataMapByIdArr(idArr, callback) {
        this.dataStore.find({'$or': idArr}, function (err, docs) {
            var playerIdMap:any = {};
            for (var playerData of docs) {
                playerIdMap[playerData.id] = playerData;
            }
            callback(err, playerIdMap);
        });
    }

    onloaded() {
        super.onloaded();
        // this.dataStore.find({$not: {id: 0}}).sort({eloScore: 1}).exec(function (err, docs) {
        //     callback(err, docs);
        // });
    }
}
function initDB() {
// Fetch a collection to insert document into
    var playerDb:string = pathEx('db/player.db');
    var activityDb:string = pathEx('db/activity.db');
    var gameDbPath:string = pathEx('db/game.db');

    db = {};
    db.player = new PlayerDB({filename: playerDb, autoload: true});
    db.activity = new ActivityDB({filename: activityDb, autoload: true});
    db.game = new GameDB({filename: gameDbPath, autoload: true});

    console.log(process.cwd());
    // Get path of project binary:
    console.log(M_path.dirname(process.execPath));
}