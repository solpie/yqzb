/// <reference path="../../model/BaseInfo.ts"/>

class PlayerData {
    id:number = 0;
    name:string = '';
    eloScore:number = 0;
    style:number = 0;//风林火山 1 2 3 4
    avatar:string = "";
    height:number = 0;
    weight:number = 0;
    dtScore:number = 0;
    winpercent:number = 0;//  胜率  100/100.0%

    gameCount:number = 0;//场数
    loseGameCount:number = 0;
    winGameCount:number = 0;
}
class PlayerInfo extends BaseInfo {
    playerData:PlayerData = new PlayerData();
    pos:number;
    isRed:Boolean = true;
    isMvp:Boolean = false;

    constructor(playerData?) {
        super();
        if (playerData) {
            this.playerData = obj2Class(playerData, PlayerData);
            if (playerData['isRed'])
                this.isRed = playerData.isRed;
        }
    }

    id(val?) {
        return prop(this.playerData, "id", val);
    }

    name(val?) {
        return prop(this.playerData, "name", val);
    }

    eloScore(val?) {
        return prop(this.playerData, "eloScore", val);
    }

    dtScore(val?) {
        return prop(this.playerData, "dtScore", val);
    }

    style(val?) {
        return prop(this.playerData, "style", val);
    }

    avatar(val?) {
        return prop(this.playerData, "avatar", val);
    }

    winpercent(val?) {
        return prop(this.playerData, "winpercent", val);
    }

    gameCount(val?) {
        return prop(this.playerData, "gameCount", val);
    }

    winGameCount(val?) {
        return prop(this.playerData, "winGameCount", val);
    }

    loseGameCount(val?) {
        return prop(this.playerData, "loseGameCount", val);
    }

    getWinPercent() {
        return (this.winpercent() * 100).toFixed(1) + "%";
    }

    getStyleIcon() {
        var path = '/img/panel/';
        if (this.style() == 1) {
            path += 'feng.png'
        }
        else if (this.style() == 2) {
            path += 'huo.png'
        }
        else if (this.style() == 3) {
            path += 'shan.png'
        }
        else if (this.style() == 4) {
            path += 'lin.png'
        }
        return path
    }

    getWinStyleIcon() {
        var path = '/img/panel/';
        if (this.style() == 1) {
            path += 'fengWin.png'
        }
        else if (this.style() == 2) {
            path += 'huoWin.png'
        }
        else if (this.style() == 3) {
            path += 'shanWin.png'
        }
        else if (this.style() == 4) {
            path += 'linWin.png'
        }
        return path
    }

    saveScore(dtScore, isWin) {
        this.dtScore(dtScore);
        this.eloScore(this.eloScore() + dtScore);
        // this.ret.push({score: this.eloScore, isWin: isWin});
        if (isWin) {
            this.winGameCount(this.winGameCount() + 1);
        }
        else
            this.loseGameCount(this.loseGameCount() + 1);

        this.gameCount(this.gameCount() + 1);
    }

    getCurWinningPercent():number {
        return this.winGameCount() / (this.loseGameCount() + this.winGameCount());
    }

    // id:number;
    // name:String;
    // score:number;
    // initScore:number;
    // winningPercent:number;//
    // ret:Array<any>;
    // countWinGame:number;
    // countLoseGame:number;
    // round:number;
}


// class Player {
//     id:number;
//     name:String;
//     score:number;
//     initScore:number;
//     winningPercent:number;//
//     ret:Array<any>;
//     countWinGame:number;
//     countLoseGame:number;
//     round:number;
//
//     constructor(id, wp, name?) {
//         this.id = id;
//         this.score = EloConf.score;
//         this.winningPercent = wp;
//         this.name = name;
//         this.ret = [];
//         this.countWinGame = 0;
//         this.countLoseGame = 0;
//         this.round = 0;
//     }
//
//
// }