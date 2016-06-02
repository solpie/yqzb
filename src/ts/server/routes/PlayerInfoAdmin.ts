/// <reference path="../../utils/JSONFile.ts"/>

class PlayerAdmin {
    static  index(req, res) {
        dbPlayerInfo().find({}, function (err, docs) {
            var data:any = {adminId: 'playerList'};
            if (!err)
                data.playerDataArr = docs;
            res.render('playerAdminIndex', data);
            console.log("/admin/player/ length:", docs.length, JSON.stringify(data.playerDataArr));
        });
    }

    static showPlayerById(req, res) {
        var playerId = req.params.id;
        var data = {adminId: 'player', op: '', playerData: {}};
        if (playerId == "new") {
            data.op = 'new';
            res.render('baseAdmin', data);
        }
        else {
            playerId = parseInt(playerId);
            data.op = 'update';
            dbPlayerInfo().find({id: playerId}, function (err, doc) {
                if (!err) {
                    data.playerData = doc[0];
                    res.render('baseAdmin', data);
                }
                else
                    res.send(err);
            });
        }
    }

    static deletePlayerData(req, res) {
        if (!req.body) return res.sendStatus(400);
        var playerId = parseInt(req.body.id);
        dbPlayerInfo().remove({id: playerId}, {}, function (err, numRemoved) {
            // numRemoved = 1
            if (!err) {
                res.send("sus");
            }
            else {
                res.send(err);
            }
        });
    }

    static makeRightType(data) {
        var newData:any = {};
        newData.id = parseInt(data.id);
        newData.phone = parseInt(data.phone);
        newData.weight = parseInt(data.weight);
        newData.height = parseInt(data.height);
        newData.eloScore = parseInt(data.eloScore);
        newData.style = parseInt(data.style);
        newData.name = data.name;
        newData.realName = data.realName;
        newData.activityId = parseInt(data.activityId);
        return newData;
    }

    static updatePlayerData(req, res) {
        if (!req.body) return res.sendStatus(400);
        console.log('updatePlayer req:', JSON.stringify(req.body));
        var playerId = parseInt(req.body.id);
        var updateData:any = PlayerAdmin.makeRightType(req.body);
        function updateToDb(data) {
            console.log('updatePlayer data:', JSON.stringify(data));
            db.player.ds().update({id: playerId}, {$set: data}, {}, function (err, doc) {
                if (!err) {
                    console.log('db data:', JSON.stringify(doc));
                    db.player.syncDataMap();
                    res.send("sus");
                }
                else {
                    console.log('updateToDb err', JSON.stringify(err));
                    res.send(err);
                }
            });
        }

        if (req.body.avatar) {
            var imgPath = "img/player/" + playerId + '.png';
            base64ToPng(imgPath, req.body.avatar, function (imgPath) {
                updateData.avatar = imgPath;
                updateToDb(updateData);
            });
        }
        else {
            updateToDb(updateData);
        }
    }

    static newPlayer(req, res) {
        if (!req.body) return res.sendStatus(400);
        var playerInfo = new PlayerInfo(req.body);
        //refactor new player method into playerDB
        playerInfo.id(db.player.getNewId());
        var imgPath1 = "img/player/" + playerInfo.id() + '.png';
        base64ToPng(imgPath1, req.body.avatar, function (imgPath) {
            playerInfo.avatar(imgPath);
            var data = PlayerAdmin.makeRightType(playerInfo.playerData);
            data.avatar = imgPath;
            dbPlayerInfo().insert(data, function (err, newDoc) {
                if (!err) {
                    db.player.saveIdUsed();
                    res.redirect("/admin/player/");
                }
                else
                    req.send(err);
            });
        });
        console.log('/admin/player/new', req.body.name);
    }
}