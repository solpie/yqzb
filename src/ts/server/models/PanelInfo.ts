/// <reference path="../../event/ActEvent.ts"/>
/// <reference path="../../model/PlayerInfo.ts"/>
class PanelInfo {
    //for localhost/panel/pid/
    stage:StagePanelInfo;
    player:PlayerPanelInfo;
    win:WinPanelInfo;

    constructor() {
        this.stage = new StagePanelInfo(PanelId.stagePanel);
        this.player = new PlayerPanelInfo(PanelId.playerPanel);
        this.win = new WinPanelInfo(PanelId.winPanel);
    }
}
class BasePanelInfo extends EventDispatcher {
    pid:string;

    constructor(pid) {
        super();
        this.pid = pid;
    }
}

class PlayerPanelInfo extends BasePanelInfo {
    playerInfo:PlayerInfo = new PlayerInfo();
    // playerInfoArr:Array<PlayerInfo> = [];

    getInfo() {
        this.playerInfo.name("tmac");
        return {
            playerInfo: this.playerInfo
        }
    }


}
class WinPanelInfo extends BasePanelInfo {
    playerInfoArr:Array<PlayerInfo> = new Array(4);

    getInfo() {
        return {
            playerInfoArr: this.playerInfoArr
        }
    }

    updatePlayerAllWin(param:any) {
        for (var i = 0; i < param.length; i++) {
            var obj = param[i];
            this.playerInfoArr[obj.pos] = obj;
            console.log(this, "updatePlayer", JSON.stringify(obj), obj.pos, obj.isRed);
        }
        cmd.emit(CommandId.updatePlayerAllWin, param, this.pid);
    }
}

class StagePanelInfo extends BasePanelInfo {
    winScore:number = 7;
    leftScore:number = 0;
    rightScore:number = 0;
    time:number = 0;
    timerState:number = 0;
    ctnXY:any;
    playerInfoArr:any = new Array(8);

    getInfo() {
        return {
            leftScore: this.leftScore,
            rightScore: this.rightScore,
            time: this.time,
            state: this.timerState,
            ctnXY: this.ctnXY,
            playerInfoArr: this.playerInfoArr
        }
    }

    addLeftScore() {
        this.leftScore = (this.leftScore + 1) % (this.winScore + 1);
        // this.broadcast(CommandId.addLeftScore, this.leftScore);
        cmd.emit(CommandId.addLeftScore, this.leftScore, this.pid);
    }

    addRightScore() {
        this.rightScore = (this.rightScore + 1) % (this.winScore + 1);
        cmd.emit(CommandId.addRightScore, this.rightScore, this.pid);
    }

    toggleTimer() {
        cmd.emit(CommandId.toggleTimer, null, this.pid);
    }

    resetTimer() {
        cmd.emit(CommandId.resetTimer, null, this.pid);
    }

    fadeOut() {
        cmd.emit(CommandId.stageFadeOut, null, this.pid);
    }

    fadeIn() {
        cmd.emit(CommandId.stageFadeIn, null, this.pid);
    }

    playerScore() {
        cmd.emit(CommandId.playerScore, null, this.pid);
    }

    movePanel(param) {
        this.ctnXY = param;
        cmd.emit(CommandId.moveStagePanel, param, this.pid);
    }

    updatePlayer(param:any) {
        var pos = param.pos;
        param.playerInfo.pos = pos;
        this.playerInfoArr[pos] = param.playerInfo;
        console.log(this, "updatePlayer", JSON.stringify(param.playerInfo), param.playerInfo.pos);
        cmd.emit(CommandId.updatePlayer, param, this.pid);
    }

    updatePlayerAll(param:any) {
        for (var i = 0; i < param.length; i++) {
            var obj = param[i];
            this.playerInfoArr[obj.pos] = obj.playerInfo;
            obj.playerInfo.pos = obj.pos;
            console.log(this, "updatePlayer", JSON.stringify(obj.playerInfo), obj.playerInfo.pos);
        }
        cmd.emit(CommandId.updatePlayerAll, param, this.pid);
    }
}