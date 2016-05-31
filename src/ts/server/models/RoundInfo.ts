/// <reference path="./DbInfo.ts"/>
class RoundInfo {
    date:number;//比赛日
    gameInfoArr:Array<GameInfo>;
    roundId:number;
    curGameId:number;
    constructor() {
        this.gameInfoArr = [];
    }

}