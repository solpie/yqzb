class ActivityPanelHandle {
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
        else if (reqCmd === CommandId.cs_startGame) {
            if (db.game.isGameFinish(param.gameData.id)) {
                res.send({isFinish: true})
            }
            else {
                server.panel.act.startGame(param);
                res.send({isFinish: false});
            }
        }
        else if (reqCmd === CommandId.cs_fadeInRankPanel) {
            server.panel.act.fadeInRankPanel(param);
            res.send("sus");
        }
        else if (reqCmd === CommandId.cs_fadeOutRankPanel) {
            server.panel.act.fadeOutRankPanel(param);
            res.send("sus");
        }
        else if (reqCmd === CommandId.cs_fadeInCountDown) {
            server.panel.act.fadeInCountDown(param);
            res.sendStatus(200);
        }
        else if (reqCmd === CommandId.cs_fadeOutCountDown) {
            server.panel.act.fadeOutCountDown(param);
            res.sendStatus(200);
        }
        else {
            db.activity.getDateArrByActivityId(param, function (docs) {
                res.send(docs);
            });
        }
    };
}