class GameInfo {
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

    constructor() {

    }

    toggleTimer() {

        if (this._timer) {
            this.resetTimer();
            this.timerState = 0;
        }
        else
        {
            this._timer = setInterval(()=> {
                this.time++;
            }, 1000);
            this.timerState = 1;
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
        var teamLeft = new TeamInfo();
        teamLeft.setPlayerArr(this.getLeftTeam());

        var teamRight = new TeamInfo();
        teamRight.setPlayerArr(this.getRightTeam());
        if (isLeftWin) {
            teamLeft.beat(teamRight);
            return teamLeft;
        }
        else {
            teamRight.beat(teamLeft);
            return teamRight;
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