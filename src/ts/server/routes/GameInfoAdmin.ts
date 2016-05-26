class GameInfoAdmin {
    static index(req, res) {
        var data = {gameDataArr: []};
        res.render('game/gameAdmin', data);
    }

    static genRound(req, res) {
        // if (!req.body) return res.sendStatus(400);
        var actId = parseInt(req.body.id);
        dbPlayerInfo().getActivityPlayerDataArr(actId, function (err, docs) {
            if (!err) {
                console.log('getActivityPlayerDataArr: ', docs.length);
                for (var i = 0; i < docs.length; i++) {
                    var playerData = docs[i];
                    console.log(playerData.name, 'elo score:', playerData.eloScore);
                }
                res.send(docs.length);
            }
            else {
                res.send(err);
            }

        });
    }
}