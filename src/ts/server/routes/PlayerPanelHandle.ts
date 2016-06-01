class PlayerPanelHandle {
    static opHandle(req, res) {
        if (!req.body) return res.sendStatus(400);
        console.log('opHandle', JSON.stringify(req.body));
        var reqCmd = req.body.cmd;
        var param = req.body.param;
        if (reqCmd === CommandId.cs_queryPlayerByPos) {
            var playerInfoArr = server.panel.stage.getPlayerDataArr();
            if (playerInfoArr && playerInfoArr.length) {
                res.send(playerInfoArr[param.pos]);
            }
            else {
                console.trace("no player on stage!!!");
                res.sendStatus(500);
            }
        }
    }
}