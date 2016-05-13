/// <reference path="PlayerInfo.ts"/>

class TeamInfo {
    name:String;
    score:Number;
    playerArr:Array<PlayerInfo>;

    constructor() {
        this.playerArr = [];
    }

    setPlayer(player:PlayerInfo, pos?:number) {
        if (pos) {
            this.playerArr.splice(player,0,pos)
        }
        else {
            this.playerArr.push(player);
        }
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
}