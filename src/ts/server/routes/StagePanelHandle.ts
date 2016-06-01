class StagePanelHandle {
    static opHandle(req, res) {
        if (!req.body) return res.sendStatus(400);
        console.log('opHandle', JSON.stringify(req.body));
        var reqCmd = req.body.cmd;
        var param = req.body.param;
        if (reqCmd === CommandId.cs_saveGameRec) {
            if (db.game.isGameFinish(param.gameId)) {
                res.send({isFinish: true});
            }
            else {
                server.panel.stage.saveGameRec(param);
                res.send({isFinish: false});
            }
        }
        else if (reqCmd === CommandId.cs_resetGame) {
            server.panel.stage.resetGame();
            res.sendStatus(200);
        }
    }
}