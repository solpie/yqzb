/// <reference path="../../event/ActEvent.ts"/>
/// <reference path="./PlayerInfo.ts"/>
/// <reference path="./TeamInfo.ts"/>
class PanelInfo {
    //for localhost/panel/pid/
    stage:StagePanelInfo;
    player:PlayerPanelInfo;
    win:WinPanelInfo;

    constructor() {
        this.stage = new StagePanelInfo(PanelId.stagePanel);
        this.player = new PlayerPanelInfo(PanelId.playerPanel);
        this.player.stageInfo = this.stage;
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
    playerData:any;
    // playerInfoArr:Array<PlayerInfo> = [];
    position:any = {ctnX: 500, ctnY: 500};
    stageInfo:StagePanelInfo;

    getInfo() {
        return {
            playerInfoArr: this.stageInfo.playerInfoArr,
            playerInfo: this.playerData,
            position: this.position
        };
    }

    showWinPanel(param:any) {
        var playerId = parseInt(param);
        for (var i = 0; i < this.stageInfo.playerInfoArr.length; i++) {
            var obj = this.stageInfo.playerInfoArr[i];
            if (obj.id == playerId) {
                this.playerData = obj;
                cmd.emit(CommandId.fadeInPlayerPanel, obj, this.pid);
            }
        }
    }

    hideWinPanel() {
        cmd.emit(CommandId.fadeOutPlayerPanel, null, this.pid);
    }

    movePanel(param:any) {
        this.position = param;
        cmd.emit(CommandId.movePlayerPanel, param, this.pid);
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
        // for (var i = 0; i < param.length; i++) {
        //     var obj = param[i];
        //     this.playerInfoArr[obj.pos] = obj;
        //     console.log(this, "updatePlayer", JSON.stringify(obj), obj.pos, obj.isRed);
        // }
        cmd.emit(CommandId.fadeInWinPanel, param, this.pid);
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
    straightScoreLeft:number = 0;//连杀判定
    straightScoreRight:number = 0;//连杀判定

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
        cmd.emit(CommandId.addLeftScore, this.leftScore, this.pid);

        this.straightScoreRight = 0;
        this.straightScoreLeft++;
        if (this.leftScore == 0)
            this.straightScoreLeft = 0;
        if (this.straightScoreLeft == 3) {
            console.log("straight score 3");
            cmd.emit(CommandId.straightScore3, {team: "left"}, this.pid);

        }
        if (this.straightScoreLeft == 5)
            cmd.emit(CommandId.straightScore5, {team: "left"}, this.pid);
    }

    addRightScore() {
        this.rightScore = (this.rightScore + 1) % (this.winScore + 1);
        cmd.emit(CommandId.addRightScore, this.rightScore, this.pid);

        this.straightScoreLeft = 0;
        this.straightScoreRight++;
        if (this.rightScore == 0)
            this.straightScoreRight = 0;
        if (this.straightScoreRight == 3)
            cmd.emit(CommandId.straightScore3, {team: "right"}, this.pid);
        if (this.straightScoreRight == 5)
            cmd.emit(CommandId.straightScore5, {team: "right"}, this.pid);
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
        // this.playerInfoArr[pos] = param.playerInfo;
        this._setPlayerPos(pos, param.playerInfo);
        console.log(this, "updatePlayer", JSON.stringify(param.playerInfo), param.playerInfo.pos);
        cmd.emit(CommandId.updatePlayer, param, this.pid);
    }

    _setPlayerPos(pos, playerInfo) {
        playerInfo.isRed = (pos > 3);
        this.playerInfoArr[pos] = playerInfo;
    }

    showWinPanel(param:any) {
        console.log("showWinPanel param:", param, param.mvp);
        for (var i = 0; i < this.playerInfoArr.length; i++) {
            var obj = this.playerInfoArr[i];
            if (obj.pos == param.mvp)
                obj.isMap = true;
            console.log(JSON.stringify(obj));
        }
        var teamLeft = new TeamInfo();
        teamLeft.setPlayerArr(appInfo.panel.stage.getLeftTeam());

        var teamRight = new TeamInfo();
        teamRight.setPlayerArr(appInfo.panel.stage.getRightTeam());

        var winTeam;
        if (param.mvp < 4) {
            winTeam = teamLeft;
            teamLeft.beat(teamRight);
        }
        else {
            winTeam = teamRight;
            teamRight.beat(teamLeft);
        }

        cmd.emit(CommandId.fadeInWinPanel, {mvp: param.mvp, playerDataArr: winTeam.playerArr}, this.pid);
        console.log(this, "after elo");
        for (var i = 0; i < this.playerInfoArr.length; i++) {
            var obj = this.playerInfoArr[i];
            console.log(JSON.stringify(obj));
        }
    }

    hideWinPanel(param:any) {
        cmd.emit(CommandId.fadeOutWinPanel, param, this.pid);
    }

    updatePlayerAll(playerDataArr:any) {

        for (var i = 0; i < playerDataArr.length; i++) {
            var obj = playerDataArr[i];
            this._setPlayerPos(obj.pos, obj.playerData);
            console.log(this, "updatePlayer", JSON.stringify(obj.playerData), obj.pos);
        }
        cmd.emit(CommandId.updatePlayerAll, this.playerInfoArr, this.pid);
    }

    getLeftTeam(start = 0) {
        var team = [];
        for (var i = start; i < 4 + start; i++) {
            var pInfo = new PlayerInfo(this.playerInfoArr[i]);
            team.push(pInfo);
            pInfo.isRed = (start > 0)
        }
        return team;
    }

    getRightTeam() {
        return this.getLeftTeam(4);
    }
}