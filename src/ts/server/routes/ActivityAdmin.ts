class ActivityAdmin {
    static getActivityDateArr(req, res) {
        if (!req.body) return res.sendStatus(400);
        console.log('getActivityDateArr', JSON.stringify(req.body));
        db.activity.getDateArrByActivityId(req.body.activityId, function (docs) {
            res.send(docs);
        });
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