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
            console.log('load config', this.dbPath);
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
        return this.config.idUsed;
    };

    getIdNew() {
        return this.config.idUsed;
    }

    ds() {
        return this.dataStore;
    }
}

class ActivityDB extends BaseDB {
    addRound(data, callback) {
        data.round = this.config.idUsed;
        this.dataStore.insert(data, (err, newDoc) => {
            if (!err) {
                var newId = this.saveIdUsed();

            }
            if (callback)
                callback(err, newDoc);
        })
    }

    getDateArrByActivityId(actId, callback) {
        this.dataStore.find({activityId: actId}, function (err, docs) {
            callback(docs);
        });
    }

    getRoundDataWithPlayerInfo(roundId, callback) {
        this.ds().find({round: roundId}, function (err, docs) {
            if (!err) {
                if (docs.length)
                    for (var i = 0; i < docs[0].gameDataArr.length; i++) {
                        var gameData = docs[0].gameDataArr;

                        db.player.getPlayerDataMapByIdArr(gameData.playerIdArr, function (err, playerIdMap) {
                            // for (var j = 0; j < gameData.playerIdArr.length; j++) {
                            //     var playerId = gameData.playerIdArr[j];
                            //     db.player.ds().find({id: playerId}, function (err, docs) {
                            //         if (!err) {
                            //
                            //         }
                            //         else
                            //             throw new Error(err);
                            //     })
                            // }
                        });

                    }
            }
            else
                throw new Error(err);
        })
    }
}
class GameDB extends BaseDB {
    startGame(gameData) {
        this.ds().update({id: gameData.id}, gameData, {upsert: true}, (err, newDoc) => {
        });
        // this.ds().insert({id: gameData}, (err, newDoc) => {
        // });
    }
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

    fillPlayerInfo(playerIdArr, dataContainer, callback) {
        this.getPlayerDataMapByIdArr(playerIdArr, function (err, playerIdMap) {
            dataContainer.playerInfoMap = {};
            for (var i = 0; i < playerIdArr.length; i++) {
                var playerId = playerIdArr[i];
                dataContainer.playerInfoMap[playerId] = new PlayerInfo(playerIdMap[playerId]);
            }
            console.log('fillPlayerInfo');
            callback();
        });
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