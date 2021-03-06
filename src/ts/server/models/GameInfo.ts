class GameInfo {
    gameId:number = 0;
    winScore:number = 7;
    leftScore:number = 0;
    rightScore:number = 0;
    time:number = 0;
    timerState:number = 0;
    data:Date;//开始时间
    straightScoreLeft:number = 0;//连杀判定
    straightScoreRight:number = 0;//连杀判定
    playerDataArr:any = new Array(8);
    playerRecArr:any = [];
    isFinish:any = null;
    _timer:number = 0;
    gameState:number = 0;//0 未确认胜负 1 确认胜负未录入数据 2确认胜负并录入数据

    _winTeam:TeamInfo;
    _loseTeam:TeamInfo;

    _teamLeft:TeamInfo;
    _teamRight:TeamInfo;

    constructor() {

    }

    getGameId() {
        return this.gameId;
    }

    toggleTimer() {
        if (this._timer) {
            this.resetTimer();
            this.timerState = 0;
        }
        else {
            this._timer = setInterval(()=> {
                this.time++;
            }, 1000);
            this.timerState = 1;
        }
    }

    saveGameRecToPlayer(gameId, isRedWin, callback) {
        // if (this.isUnsaved) {
        if (this.gameState === 0) {
            if (isRedWin)
                this.setRightTeamWin();
            else
                this.setLeftTeamWin();
        }
        var saveTeamPlayerData = (teamInfo:TeamInfo)=> {
            for (var playerInfo of teamInfo.playerInfoArr) {
                console.log("playerData", JSON.stringify(playerInfo));
                if (!playerInfo.gameRec())
                    playerInfo.gameRec([]);
                playerInfo.gameRec().push(gameId);
                console.log(playerInfo.name(), " cur player score:", playerInfo.eloScore(), playerInfo.dtScore());
                db.player.ds().update({id: playerInfo.id()}, {$set: playerInfo.playerData}, {}, (err, doc)=> {
                    savePlayerCount--;
                    console.log("saveGameRecToPlayer:", savePlayerCount);
                    if (savePlayerCount === 0) {
                        console.log("change game state 2 and callback");
                        this.gameState = 2;
                        db.player.syncDataMap(callback);
                    }
                });
            }
        };

        var savePlayerCount = 8;
        saveTeamPlayerData(this._winTeam);
        saveTeamPlayerData(this._loseTeam);
    }

    resetTimer() {
        clearInterval(this._timer);
        this._timer = 0;
    }

    setPlayerInfoByPos(pos, playerData) {
        playerData.isRed = (pos > 3);
        this.playerDataArr[pos] = playerData;
    }

    _setGameResult(isLeftWin) {
        var teamLeft = new TeamInfo();
        teamLeft.setPlayerArr(this.getLeftTeam());

        var teamRight = new TeamInfo();
        teamRight.setPlayerArr(this.getRightTeam());

        if (isLeftWin) {
            teamLeft.beat(teamRight);
            this._winTeam = teamLeft;
            this._loseTeam = teamRight;
        }
        else {
            teamRight.beat(teamLeft);
            this._winTeam = teamRight;
            this._loseTeam = teamLeft;
        }
        console.log("playerData", JSON.stringify(this.playerDataArr));
        this.gameState = 1;
        return this._winTeam;
    }


    setLeftTeamWin() {
        return this._setGameResult(true);
    }

    setRightTeamWin() {
        return this._setGameResult(false);
    }

    getPlayerDataArr():Array<any> {
        return this.playerDataArr;
    }


    getLeftTeam(start = 0) {
        var team = [];
        for (var i = start; i < 4 + start; i++) {
            var pInfo = new PlayerInfo(this.playerDataArr[i]);
            team.push(pInfo);
            pInfo.isRed = (start > 0)
        }
        return team;
    }

    getRightTeam() {
        return this.getLeftTeam(4);
    }
}