class StagePanelHandle {
    static opHandle(req, res) {
        if (!req.body) return res.sendStatus(400);
        console.log('opHandle', JSON.stringify(req.body));
        var reqCmd = req.body.cmd;
        var param = req.body.param;
        if (reqCmd === CommandId.cs_saveGameRec) {
            server.panel.stage.saveGameRec(param);
            res.sendStatus(200);
        }
    }
}