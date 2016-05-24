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

    static updatePlayer(req, res) {

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