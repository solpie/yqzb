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
        }
        else {
            db.activity.getDateArrByActivityId(param, function (docs) {
                res.send(docs);
            });
        }
    };

    static index(req, res) {
        var actId = req.params.id;
        var data = {activityId: actId};
        res.render('activity/activityAdmin', data);
    }

    static genPrintPng(req, res) {
        base64ToPng('img/cache/game.png', req.body.base64, function () {
            res.send('/img/cache/game.png');
        })
    }

    static genActivity(req, res) {
        if (!req.body) return res.sendStatus(400);
        console.log('gen activity ', JSON.stringify(req.body.activityData));
        db.activity.addActivity(req.body.activityData);
    }

    static getActivityPlayerArr(req, res) {
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