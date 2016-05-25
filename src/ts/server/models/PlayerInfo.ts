/// <reference path="../../model/BaseInfo.ts"/>
class PlayerData {
    id:number = 0;
    name:string = '';
    phone:number = 0;
    eloScore:number = 0;
    style:number = 0;//风林火山 1 2 3 4
    avatar:string = "";
    height:number = 0;
    weight:number = 0;
    dtScore:number = 0;//最近一场天梯分变化
    winpercent:number = 0;//  胜率  100/100.0%
    activityId:number = 0;//赛事id
    gameRec:Array<number> = [];//比赛记录
    gameCount:number = 0;//场数
    loseGameCount:number = 0;
    winGameCount:number = 0;
}

class PlayerInfo extends BaseInfo {
    playerData:PlayerData = new PlayerData();
    pos:number;
    isRed:Boolean = true;
    isMvp:Boolean = false;
    backNumber:number;//当场球衣号码

    constructor(playerData?) {
        super();
        if (playerData) {
            this.playerData = obj2Class(playerData, PlayerData);
            if (playerData['isRed'] != null)
                this.isRed = playerData.isRed;
            if (playerData['isMvp'] != null)
                this.isMvp = playerData.isMvp;
            if (playerData['backNumber'] != null)
                this.backNumber = playerData.backNumber;
        }
    }
    
    getPlayerData(){
        this.playerData['isRed'] = this.isRed;
        this.playerData['isMvp'] = this.isMvp;
        this.playerData['backNumber'] = this.backNumber;
        return this.playerData;
    }

    id(val?) {
        return prop(this.playerData, "id", val);
    }

    phone(val?) {
        return prop(this.playerData, "phone", val);
    }

    name(val?) {
        return prop(this.playerData, "name", val);
    }

    activityId(val?) {
        return prop(this.playerData, "activityId", val);
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

    gameRec(val?) {
        return prop(this.playerData, "gameRec", val);
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
}
