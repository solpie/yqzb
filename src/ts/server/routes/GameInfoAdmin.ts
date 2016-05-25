class GameInfoAdmin {
    static index(req, res) {
        var data = {gameDataArr: []};
        res.render('game/gameAdmin', data);
    }

    static genRound(req, res) {
        // if (!req.body) return res.sendStatus(400);
        var playerDataArr;
        var actId = parseInt(req.body.id);
        dbPlayerInfo().getActivityPlayerDataArr(actId, function (err, docs) {
            console.log("get Activity player arr", JSON.stringify(docs));
            for (var i = 0; i < res.length; i++) {
                var obj = res[i];

            }
            res.send(docs.length);
        });
    }
}