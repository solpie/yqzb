/// <reference path="BaseInfo.ts"/>

class PlayerData {
    id:number = 0;
    name:string = '';
    eloScore:number = 0;
    style:number = 0;//风林火山 1 2 3 4
    avatar:string = "";
    height:number = 0;
    weight:number = 0;
    winpercent:number = 0;//  胜率  100/100.0%
    gameCount:number = 0;//场数
    dtScore:number = 0;
}
class PlayerInfo extends BaseInfo {
    playerData:PlayerData = new PlayerData();
    isRed:Boolean = true;
    isMvp:Boolean = false;

    constructor(playerData?) {
        super();
        if (playerData) {
            this.playerData = obj2Class(playerData, PlayerData);
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

    getWinPercent() {
        return (this.winpercent() * 100).toFixed(1) + "%";
    }

    // static getPlayerInfo(pid) {
    //     jsonfile.readFile("data/" + pid + '.player', null, (err, data)=> {
    //         var playerInfo = new PlayerInfo();
    //         playerInfo = data;
    //         return playerInfo
    //     });
    // }


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
}