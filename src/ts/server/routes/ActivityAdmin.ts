class ActivityAdmin {
    static opHandle(req, res) {
        if (!req.body) return res.sendStatus(400);
        console.log('opHandle', JSON.stringify(req.body));
        var reqCmd = req.body.cmd;
        var param = req.body.param;
        if (reqCmd === CommandId.cs_fadeInActPanel) {
            server.panel.act.fadeInActPanel(param);
            res.send("sus");
        }
        else if (reqCmd === CommandId.cs_fadeOutActPanel) {
            server.panel.act.fadeOutActPanel();
            res.send("sus");
        }
        else {
            db.activity.getDateArrByActivityId(param, function (docs) {
                res.send(docs);
            });
        }
    };

    static index(req, res) {
        var actId = req.params.id;
        var data = {activityId: actId, lastRound: db.activity.config.idUsed};
        res.render('activity/activityAdmin', data);
    }

    static genPrintPng(req, res) {
        base64ToPng('img/cache/game.png', req.body.base64, function () {
            res.send('/img/cache/game.png');
        })
    }

    static genRound(req, res) {
        if (!req.body) return res.sendStatus(400);
        var actData:any = req.body.activityData;
        actData.round = db.activity.getIdNew();
        for (var i = 0; i < actData.gameDataArr.length; i++) {
            var gameData = actData.gameDataArr[i];
            gameData.id = actData.round * 1000 + i;
        }
        console.log('gen activity ', JSON.stringify(actData));
        db.activity.addRound(actData, (err, newdoc)=> {
            //todo return gameId to client
            res.send(err);
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