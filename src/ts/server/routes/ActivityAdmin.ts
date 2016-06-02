class ActivityAdmin {
    static index(req, res) {
        var actId = req.params.id;
        var data = {
            activityId: actId,
            lastRound: db.activity.config.idUsed,
            roundData: 'null',
            round: 0,
            playerMap: "{}"
        };
        res.render('activity/activityAdmin', data);
    }

    static round(req, res) {
        var actId = req.params.id;
        var roundId:number = parseInt(req.params.round);

        db.activity.getDataByRound(roundId, (err, doc)=> {
            if (doc && doc.length) {

            }
        });

        var data:any = {
            activityId: actId,
            lastRound: db.activity.config.idUsed,
            round: roundId,
            playerMap: JSON.stringify(db.player.dataMap)
        };
        if (roundId) {
            db.activity.ds().find({round: roundId}, function (err, docs) {
                if (!err) {
                    if (docs.length) {
                        var playerIdArr = [];
                        for (var i = 0; i < docs[0].gameDataArr.length; i++) {
                            var gameData:any = docs[0].gameDataArr[i];
                            playerIdArr = playerIdArr.concat(gameData.playerIdArr);
                        }
                        db.player.fillPlayerInfo(playerIdArr, docs[0], function () {
                            data.roundData = JSON.stringify(docs[0]);
                            console.log('activity/activityAdmin render');
                            res.render('activity/activityAdmin', data);
                        });
                    }
                    else
                        res.sendStatus(404);
                }
                else
                    res.sendStatus(500);
            })
        }
        else {
            res.send('没有轮');
        }
    }

    static genPrintPng(req, res) {
        base64ToPng('img/cache/game.png', req.body.base64, function () {
            res.send('/img/cache/game.png');
        })
    }

    static addGame(req, res) {
        if (!req.body) return res.sendStatus(400);
        var gameData = req.body.gameData;
        console.log("addGame req", JSON.stringify(req.body));
        db.activity.addGame(gameData.activityId,
            gameData.roundId,
            gameData.playerIdArr,
            gameData.section,
            function (sus) {
                if (sus) {
                    res.sendStatus(200);
                }
                else {
                    res.sendStatus(400);
                }
            })
    }

    static genRound(req, res) {
        if (!req.body) return res.sendStatus(400);
        var actData:any = req.body.activityData;
        actData.round = db.activity.getIdNew();
        for (var i = 0; i < actData.gameDataArr.length; i++) {
            var gameData = actData.gameDataArr[i];
            gameData.id = actData.round * db.activity.getGameIdBase(actData.round) + i;
            actData.section = gameData.section;
        }
        console.log('gen activity ', JSON.stringify(actData));
        db.activity.addRound(actData, (err, newdoc)=> {
            //todo return gameId to client
            res.send({roundId: actData.round});
        });
        // db.game.addGame();
    }

    static getActivityPlayerArr(req, res) {
        if (!req.body) return res.sendStatus(400);
        var actId = parseInt(req.body.id);
        db.player.getActivityPlayerDataArr(actId, function (err, docs) {
            if (!err) {
                res.send(docs);
            }
            else {
                res.send(err);
            }
        });
    }
}