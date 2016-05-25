class GameInfo {
    gameId:number = 0;
    winScore:number = 7;
    leftScore:number = 0;
    rightScore:number = 0;
    time:number = 0;
    timerState:number = 0;
    data:Date;
    straightScoreLeft:number = 0;//连杀判定
    straightScoreRight:number = 0;//连杀判定
    playerInfoArr:any = new Array(8);

    _timer:number = 0;
    playerDb:any;
    _isUnsaved:Boolean = false;//未保存状态
    _winTeam:TeamInfo;
    _loseTeam:TeamInfo;

    constructor() {

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

    saveGameRec() {
        if (this._isUnsaved) {
            this._isUnsaved = false;
            for (var i = 0; i < this._winTeam.playerInfoArr.length; i++) {
                var playerInfo:PlayerInfo = this._winTeam.playerInfoArr[i];
                console.log("playerData", JSON.stringify(playerInfo));
                if (!playerInfo.gameRec())
                    playerInfo.gameRec([]);
                playerInfo.gameRec().push(this.gameId);
                console.log(playerInfo.name(), " cur player score:", playerInfo.eloScore(), playerInfo.dtScore());
                this.playerDb.update({id: playerInfo.id()}, {$set: playerInfo.playerData}, {}, function (err, doc) {
                    console.log("saveGameRec: game rec saved");
                })
            }
            for (var i = 0; i < this._loseTeam.playerInfoArr.length; i++) {
                var playerInfo:PlayerInfo = this._loseTeam.playerInfoArr[i];
                console.log("playerData", JSON.stringify(playerInfo));
                if (!playerInfo.gameRec())
                    playerInfo.gameRec([]);
                playerInfo.gameRec().push(this.gameId);
                console.log(playerInfo.name(), " cur player score:", playerInfo.eloScore(), playerInfo.dtScore());
                this.playerDb.update({id: playerInfo.id()}, {$set: playerInfo.playerData}, {}, function (err, doc) {
                    console.log("lose saveGameRec: game rec saved");
                })
            }
        }
    }

    resetTimer() {
        clearInterval(this._timer);
        this._timer = 0;
    }

    setPlayerInfoByPos(pos, playerInfo) {
        playerInfo.isRed = (pos > 3);
        this.playerInfoArr[pos] = playerInfo;
    }

    _setGameResult(isLeftWin) {
        if (!this._isUnsaved) {
            console.log("setGameResult: game rec unsaved");
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
            this.playerInfoArr = teamLeft.getPlayerDataArr().concat(teamRight.getPlayerDataArr());
            console.log("playerData", JSON.stringify(this.playerInfoArr));

            this._isUnsaved = true;
            return this._winTeam;
        }
    }


    setLeftTeamWin() {
        return this._setGameResult(true);
    }

    setRightTeamWin() {
        return this._setGameResult(false);
    }

    getPlayerInfoArr():Array<any> {
        return this.playerInfoArr;
    }


    getLeftTeam(start = 0) {
        var team = [];
        for (var i = start; i < 4 + start; i++) {
            var pInfo = new PlayerInfo(this.playerInfoArr[i]);
            team.push(pInfo);
            pInfo.isRed = (start > 0)
        }
        return team;
    }

    getRightTeam() {
        return this.getLeftTeam(4);
    }
}