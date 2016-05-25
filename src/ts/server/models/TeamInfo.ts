/// <reference path="./PlayerInfo.ts"/>
/// <reference path="./EloInfo.ts"/>

class TeamInfo {
    name:string;
    score:number;
    playerInfoArr:Array<PlayerInfo>;

    constructor() {
        this.playerInfoArr = [];
    }

    setPlayer(player:PlayerInfo, pos?:number) {
        // if (pos) {
        //     this.playerArr.splice(player,0,pos)
        // }
        // else {
        //     this.playerArr.push(player);
        // }
    }

    setScore(score) {
        this.score = score;
    }

    setName(name) {
        this.name = name;
    }

    clear() {
        this.score = 0;
    }


    // winningPercent:number;
    // score:number;
    // name:string;
    // playerArr:Array<PlayerInfo>;
    // ret:Array<any>;


    // constructor(winPercentage?:number, scoreAvg?:number) {
    //     // this.winningPercent = winPercentage;
    //     this.score = scoreAvg;
    //     this.playerArr = [];
    // }

    setPlayerArr(playerArr:Array<PlayerInfo>) {
        this.playerInfoArr.length = 0;
        this.playerInfoArr = this.playerInfoArr.concat(playerArr);
        this.score = 0;
        for (var i = 0; i < this.playerInfoArr.length; i++) {
            var player = this.playerInfoArr[i];
            this.score += player.eloScore();
        }
        this.score /= this.playerInfoArr.length;
        console.log(this, "player score:", this.score);
    }

    beat(loserTeam:TeamInfo) {
        var Elo1 = this.score;

        var Elo2 = loserTeam.score;

        var K = EloConf.K;

        var EloDifference = Elo2 - Elo1;

        var percentage = 1 / ( 1 + Math.pow(10, EloDifference / 400) );

        var win = Math.round(K * ( 1 - percentage ));

        //this.score += win;
        this.saveScore(win, true);
        loserTeam.saveScore(-win, false);
        //loserTeam.score -= win;
        // this.getWinningPercent() = Math.round(percentage * 100);
    }

    getPercentage() {
        //var Elo1 = this.score;
        //
        //var Elo2 = loserTeam.score;
        //
        //var K = EloConf.K;
        //
        //var EloDifference = Elo2 - Elo1;
        //
        //var percentage = 1 / ( 1 + Math.pow(10, EloDifference / 400) );
    }

    saveScore(score, isWin) {
        this.score += score;
        for (var i = 0; i < this.playerInfoArr.length; i++) {
            var player = this.playerInfoArr[i];
            player.saveScore(score, isWin);
        }
    }

    getPlayerDataArr() {
        var a = [];
        for (var i = 0; i < this.playerInfoArr.length; i++) {
            var playerInfo:PlayerInfo = this.playerInfoArr[i];
            a.push(playerInfo.getPlayerData());
        }
        return a;
    }

    getWinningPercent():number {
        var wp;
        for (var i = 0; i < this.playerInfoArr.length; i++) {
            var player = this.playerInfoArr[i];
            wp += player.getCurWinningPercent();
        }
        wp /= this.playerInfoArr.length;
        return wp;
    }
}
