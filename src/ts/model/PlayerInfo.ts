/**
 * Created by toramisu on 2016/5/12.
 */
class PlayerInfo {
    name:string;
    eloScore:number;
    style:number;//风林火山 1 2 3 4
    avatar:string;
    height:number;
    weight:number;

    constructor() {

    }

    static getPlayerInfo(pid) {
        var playerInfo = new PlayerInfo();

        return playerInfo
    }

    getStyleIcon() {
        var path = '/img/icon/';
        if (this.style == 1) {
            path += 'feng.png'
        }
        else if (this.style == 2) {
            path += 'huo.png'
        }
        else if (this.style == 3) {
            path += 'shan.png'
        }
        else if (this.style == 4) {
            path += 'lin.png'
        }
        return path
    }
}