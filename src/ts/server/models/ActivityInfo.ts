/// <reference path="./DbInfo.ts"/>
class ActivityInfo {
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