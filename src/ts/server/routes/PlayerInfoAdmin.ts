class PlayerAdmin {
    constructor() {

    }

    static newPlayer(req, res) {
        if (!req.body) return res.sendStatus(400);
        var playerInfo = new PlayerInfo(req.body);
        var imgPath = "img/player/" + playerInfo.id() + '.png';
        console.log('/admin/player/new', req.body.name, req.body.avatar);

        var base64Data = playerInfo.avatar().replace(/^data:image\/png;base64,/, "");

        writeFile(imgPath, base64Data, 'base64', (err)=> {
            if (!err) {
                playerInfo.avatar("/" + imgPath);
                dbPlayerInfo().insert(playerInfo.playerData, function (err, newDoc) {
                    if (!err)
                        res.send("sus");
                    else
                        req.send(err);
                });
            }
            else
                res.send(err);
        });
    }
}