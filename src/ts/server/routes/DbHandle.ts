class DbHandle {
    static opHandle(req, res) {
        if (!req.body) return res.sendStatus(400);
        console.log('opHandle', JSON.stringify(req.body));
        var reqCmd = req.body.cmd;
        var param = req.body.param;
        if (reqCmd === CommandId.cs_findPlayerData) {
            var playerDataArr = [];
            var playerDataMap:any = {};
            for (var playerId of param.playerIdArr) {
                playerDataArr.push(db.player.dataMap[playerId]);
                playerDataMap[playerId] = db.player.dataMap[playerId];
            }
            playerDataArr.sort(sortCompare('eloScore'));
            res.send({playerDataArr: playerDataArr, playerDataMap: playerDataMap});
        }
        else {
            res.sendStatus(400);
        }
    }
}