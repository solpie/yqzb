/// <reference path="./PlayerInfo.ts"/>
/// <reference path="./EloInfo.ts"/>

class TeamInfo {
    name:string;
    score:number;
    playerArr:Array<PlayerInfo>;

    constructor() {
        this.playerArr = [];
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
        this.playerArr.length = 0;
        this.playerArr = this.playerArr.concat(playerArr);
        this.score = 0;
        for (var i = 0; i < this.playerArr.length; i++) {
            var player = this.playerArr[i];
            this.score += player.eloScore();
        }
        this.score /= this.playerArr.length;
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
        for (var i = 0; i < this.playerArr.length; i++) {
            var player = this.playerArr[i];
            player.saveScore(score, isWin);
        }
    }

    getWinningPercent():number {
        var wp;
        for (var i = 0; i < this.playerArr.length; i++) {
            var player = this.playerArr[i];
            wp += player.getCurWinningPercent();
        }
        wp /= this.playerArr.length;
        return wp;
    }
}
