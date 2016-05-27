class GameInfoAdmin {
    static index(req, res) {
        var data = {gameDataArr: []};
        res.render('game/gameAdmin', data);
    }

    static genPrintPng(req, res) {
        base64ToPng('img/cache/game.png', req.body.base64, function () {
            res.send('/img/cache/game.png');
        })
    }

    static genRound(req, res) {
        if (!req.body) return res.sendStatus(400);
        var actId = parseInt(req.body.id);

        dbPlayerInfo().getActivityPlayerDataArr(actId, function (err, docs) {
            if (!err) {
                res.send(docs);
            }
            else {
                res.send(err);
            }

        });
    }
}