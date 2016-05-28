/// <reference path="./DbInfo.ts"/>
class ActivityInfo {
    date:number;//比赛日
    gameInfoArr:Array<GameInfo>;

    constructor() {

    }

    round() {
        var playerDataArr;
        dbPlayerInfo().getActivityPlayerDataArr(1, function (err, docs) {
            console.log("get Activity player arr", JSON.stringify(docs));
        });
    }
}