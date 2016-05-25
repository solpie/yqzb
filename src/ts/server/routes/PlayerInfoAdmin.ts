/// <reference path="../../utils/JSONFile.ts"/>

class PlayerAdmin {
    static base64ToPng(imgPath, base64Data, callback) {
        var base64Data = base64Data.replace(/^data:image\/png;base64,/, "");
        var writePath = imgPath;
        if (!isDev)
            writePath = M_path.join(appExecPath, imgPath);
        writeFile(writePath, base64Data, 'base64', (err)=> {
            if (!err) {
                callback('/' + imgPath);
            }
        });
    }

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

    static updatePlayerData(req, res) {
        if (!req.body) return res.sendStatus(400);
        console.log('updatePlayer req:', JSON.stringify(req.body));
        var playerId = parseInt(req.body.id);
        var updateData:any = {};
        updateData.phone = parseInt(req.body.phone);
        updateData.weight = parseInt(req.body.weight);
        updateData.height = parseInt(req.body.height);
        updateData.eloScore = parseInt(req.body.eloScore);
        updateData.style = parseInt(req.body.style);
        updateData.name = req.body.name;
        updateData.activityId = parseInt(req.body.activityId);
        function updateToDb(data) {
            console.log('updatePlayer data:', JSON.stringify(data));
            dbPlayerInfo().update({id: playerId}, {$set: data}, {}, function (err, doc) {
                if (!err) {
                    console.log('db data:', JSON.stringify(doc));
                    if (doc) {
                        res.send("sus");
                    }
                    else {
                        res.send("no id!!!");
                    }
                }
                else {
                    res.send(err);
                }
            });
        }

        if (req.body.avatar) {
            var imgPath = "img/player/" + playerId + '.png';
            PlayerAdmin.base64ToPng(imgPath, req.body.avatar, function (imgPath) {
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
        playerInfo.id(dbPlayerInfo().getNewId());
        var imgPath = "img/player/" + playerInfo.id() + '.png';
        PlayerAdmin.base64ToPng(imgPath, req.body.avatar, function (imgPath) {
            playerInfo.avatar(imgPath);
            dbPlayerInfo().insert(playerInfo.playerData, function (err, newDoc) {
                if (!err) {
                    dbPlayerInfo().saveIdUsed();
                    res.redirect("/admin/player/");
                }
                else
                    req.send(err);
            });
        });
        console.log('/admin/player/new', req.body.name);
    }
}