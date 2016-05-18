/// <reference path="BaseInfo.ts"/>

class PlayerData {
    id:number;
    name:string;
    eloScore:number;
    style:number;//风林火山 1 2 3 4
    avatar:string;
    height:number;
    weight:number;
    winpercent:number;//  胜率  100/100.0%
    gameCount:number;//场数
    dtScore:number;
}
class PlayerInfo extends BaseInfo{
    playerData:PlayerData = new PlayerData();


    id(val?) {
        return prop(this.playerData, "id", val);
    }

    name(val?) {
        return prop(this.playerData, "name", val);
    }

    eloScore(val?) {
        return prop(this.playerData, "eloScore", val);
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
        var path = '/img/icon/';
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
}