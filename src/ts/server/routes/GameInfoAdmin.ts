class GameInfoAdmin {
    static index(req, res) {
        var data = {gameDataArr: []};
        res.render('game/gameAdmin', data);
    }

    static genRound(req, res) {
        // if (!req.body) return res.sendStatus(400);
        var actId = parseInt(req.body.id);
        dbPlayerInfo().getActivityPlayerDataArr(actId, function (err, docs) {
            if (!err) {
                console.log('getActivityPlayerDataArr: ', docs.length);
                function getSection(playerDataArr, start = 0) {
                    var playerData;
                    var section = [];
                    // var team = [];
                    var teamInfo:TeamInfo = new TeamInfo();
                    //low section
                    for (var i = start; i < start + 16; i++) {
                        playerData = playerDataArr[i];
                        if (teamInfo.length() == 4) {
                            section.push(teamInfo);
                            teamInfo = new TeamInfo();
                        }
                        teamInfo.push(new PlayerInfo(playerData));
                        console.log(playerData.name, 'elo score:', playerData.eloScore);
                    }
                    // for (var i = 0; i < section.length; i++) {
                    //     var t:TeamInfo = section[i];
                    //     console.log('low section team:', t.length(), JSON.stringify(t));
                    // }
                    return section;
                }

                var lowSection = getSection(docs, 0);
                var highSection = getSection(docs, 16);
                res.send(new Buffer(msgpack.encode({test:"sss"})));
                // res.send(msgpack.encode({low: lowSection, high: highSection}));
            }
            else {
                res.send(err);
            }

        });
    }
}