var playerIdBase = 10000;
class PlayerAdmin {

    static showPlayer(req, res) {
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

    static updatePlayerData(req, res) {
        if (!req.body) return res.sendStatus(400);
        console.log('updatePlayer req:', JSON.stringify(req.body));

        var isUpdateImg = req.body.isUpdateImg;
        var playerId = parseInt(req.body.id);
        var updateData:any = {};
        updateData.phone = parseInt(req.body.phone);
        updateData.weight = parseInt(req.body.weight);
        updateData.height = parseInt(req.body.height);
        updateData.eloScore = parseInt(req.body.eloScore);
        updateData.style = parseInt(req.body.style);
        updateData.name = req.body.name;
        if (isUpdateImg) {
            updateData.avatar = req.body.avatar;
        }
        console.log('updatePlayer data:', JSON.stringify(updateData));

        dbPlayerInfo().update({id: playerId}, {$set: updateData}, {}, function (err, doc) {
            if (!err) {
                if (doc.length) {
                    return res.send("sus");
                }
                else {
                    return res.send("no id!!!");
                }
            }
            else {
                return res.send(err);
            }
        });
    }

    static newPlayer(req, res) {
        if (!req.body) return res.sendStatus(400);
        var playerInfo = new PlayerInfo(req.body);
        dbPlayerInfo().count({}, function (err, count) {
            playerInfo.id(playerIdBase + count);
            var imgPath = "img/player/" + playerInfo.id() + '.png';
            console.log('/admin/player/new', req.body.name);
            var base64Data = playerInfo.avatar().replace(/^data:image\/png;base64,/, "");
            writeFile(imgPath, base64Data, 'base64', (err)=> {
                if (!err) {
                    playerInfo.avatar("/" + imgPath);
                    dbPlayerInfo().insert(playerInfo.playerData, function (err, newDoc) {
                        if (!err)
                            res.redirect("/admin/player/" + playerInfo.id());
                        else
                            req.send(err);
                    });
                }
                else
                    res.send(err);
            });
        });


    }
}